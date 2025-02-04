variable bucket_name {
    type    = string
    default = "define_externally"
}

variable function_names {
  type = list(string)
  default = [ "connect", "disconnect", "default", "authorizer" ]
}

variable function_configurations {
    type = map(object({
        name = string
        path = string
    }))
    default = {
        connect =    { name = "connect",    path = "$connect" }
        disconnect = { name = "disconnect", path = "$disconnect" }
        default =    { name = "default",    path = "$default" }
    }
}
