#   Create IAM trust-policy    
data aws_iam_policy_document assume_role {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}


#   Configure permission: Allow put object on the target bucket
data aws_iam_policy_document s3_permmissions {
    statement {
      effect = "Allow"
      actions = ["s3:PutObject", "s3:DeleteObject"]
      resources = ["${data.aws_s3_bucket.target_bucket.arn}/*"]
    }
}


#   Make a new policy for s3 permissions
resource aws_iam_policy s3_permissions_policy {
    name = "nxt-ws-s3_permissions_policy"
    policy = data.aws_iam_policy_document.s3_permmissions.json
}


#   IAM role for all lambdas
resource aws_iam_role iam_for_lambda {
  name               = "nxt-ws-iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}


#   Add execution permissions to lambda role
resource aws_iam_role_policy_attachment lambda_execution_role {
    role = aws_iam_role.iam_for_lambda.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


#   Add cloudwatch permissions to lambda role
resource aws_iam_role_policy_attachment cloudwatch_full_access {
    role = aws_iam_role.iam_for_lambda.name
    policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccessV2"
}

#   Add full access to Api Gateway
resource "aws_iam_role_policy_attachment" "apigateway_full_access" {
    role = aws_iam_role.iam_for_lambda.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess"
}

#   Add s3 permissions policy to lambda role
resource aws_iam_role_policy_attachment s3_permissions_attachment {
  role = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.s3_permissions_policy.arn
}


#   Uploads zip to s3
resource aws_s3_object s3objects {
    for_each = toset(var.function_names)
    bucket = data.aws_s3_bucket.target_bucket.bucket
    key    = each.key
    source = ".packages/${each.key}.zip"
}


#   Create Lambda's from s3 object
resource aws_lambda_function lambdas {
    for_each = aws_s3_object.s3objects    
    function_name = "nxt-ws-${each.value.key}"
    role          = aws_iam_role.iam_for_lambda.arn
    handler       = "index.handler"
    runtime       = "nodejs22.x"
    s3_bucket     = each.value.bucket
    s3_key        = each.value.key
    source_code_hash = each.value.etag
    environment {
        variables = {
            bucketname = var.bucket_name
            WS_ENDPOINT = aws_apigatewayv2_stage.stage.invoke_url
        }
    }
}


#   Set permissions on all route-related lambdas
resource aws_lambda_permission websocket_permissions {
    for_each = aws_apigatewayv2_route.routes
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.lambdas[lookup(var.function_configurations, each.key).name].function_name
    principal = "apigateway.amazonaws.com"    
    source_arn = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/${each.value.route_key}"
}