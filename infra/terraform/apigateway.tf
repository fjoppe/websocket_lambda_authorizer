#   Create api gateway for websocket
resource aws_apigatewayv2_api websocket_api {
  name          = "nxt-ws-apigateway"
  protocol_type = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}


#   Create integration between route and lambda
resource aws_apigatewayv2_integration websocket_integrations {
    for_each         = var.function_configurations
    api_id           = aws_apigatewayv2_api.websocket_api.id
    integration_type = "AWS_PROXY"
    integration_method = "POST"
    integration_uri  = aws_lambda_function.lambdas[each.key].invoke_arn
}


#   Create routes
resource aws_apigatewayv2_route routes {
    for_each  = aws_apigatewayv2_integration.websocket_integrations
    api_id    = aws_apigatewayv2_api.websocket_api.id
    route_key = lookup(var.function_configurations, each.key).path
    target    = "integrations/${each.value.id}"

    #   conditionally add authorizer, only for connect-integration
    authorization_type = each.key == "connect" ? "CUSTOM" : null
    authorizer_id = each.key == "connect" ? aws_apigatewayv2_authorizer.authorizer.id : null
}


#   Create stage
resource aws_apigatewayv2_stage stage {
  api_id      = aws_apigatewayv2_api.websocket_api.id
  name = "stage"
  auto_deploy = true
}


#   Create authorizer trust policy
data aws_iam_policy_document authorizer_assume_policy_document {
    statement {
        effect = "Allow"
        principals {
            type = "Service"
            identifiers = ["apigateway.amazonaws.com"]
        }
        actions = ["sts:AssumeRole"]
    }
}


#   Create authorizer permissions policy
data aws_iam_policy_document authorizer_permission_policy_document {
    statement {
        effect = "Allow"
        actions = [
            "lambda:InvokeFunction",
            "logs:*"
        ]
        resources = ["*"]
    }
}


#   Create authorizer role
resource aws_iam_role authorizer_invoke_role {
    name = "authorizer_invoke_role"
    assume_role_policy = data.aws_iam_policy_document.authorizer_assume_policy_document.json
}


#   Create authorizer policy
resource aws_iam_policy authorizer_policy {
    name = "nxt-ws-authorizer-policy"
    policy = data.aws_iam_policy_document.authorizer_permission_policy_document.json
}


#   Attach permissions to role
resource aws_iam_role_policy_attachment authorizer_invoke_role_attachment {
    policy_arn = aws_iam_policy.authorizer_policy.arn
    role = aws_iam_role.authorizer_invoke_role.name
}


#   Create authorizer
resource aws_apigatewayv2_authorizer authorizer {
    name = "nxt-ws-authorizer"
    api_id = aws_apigatewayv2_api.websocket_api.id
    authorizer_credentials_arn  = aws_iam_role.authorizer_invoke_role.arn
    authorizer_type = "REQUEST"
    authorizer_uri = aws_lambda_function.lambdas["authorizer"].invoke_arn
    identity_sources = ["route.request.querystring.token"] 
}