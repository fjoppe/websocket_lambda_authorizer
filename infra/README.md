# Provisioning Infrastructure

The scripts in this folder deploy/destroy the AWS backend.
An s3 bucket with a random name is created, which will be used in the rest of this project. The s3 bucket-name is stored in a file called `.bucketname`

Prerequisite: build the backend before using these scripts

## Deploy

To deploy the infrastructure to AWS, in a bash terminal, in the `infra` folder:

```bash
./deploy.sh
```

When prompted during the script, enter `yes` to provision the infrastructure.
After this step, continue with running the client application.

## Cleanup

When you are finished with the project and want to clean up do the followin.
In a bash terminal, in the `infra` folder: :

```bash
./destroy.sh
```

When prompted during the script, enter `yes` to delete the infrastructure.
Note: the s3 bucket created needs to be removed manually. Either do this via the AWS console, or find its name in a file called `.bucketname` in the `infra` folder.

## Remarks

The Terraform scripts create multiple infrastructures with a single statement. This is done with the "for_each" construct.
Another interesting aspect is that only the `$connect` path may have a Lambda Authorizer, this setting is configured conditionally.
