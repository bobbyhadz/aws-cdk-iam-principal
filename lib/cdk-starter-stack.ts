import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create a role with a Service Principal
    const role1 = new iam.Role(this, 'role-1', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const policy1 = new iam.PolicyStatement({
      resources: ['arn:aws:logs:*:*:log-group:/aws/lambda/*'],
      actions: ['logs:FilterLogEvents'],
    });
    // 👇 add a service principal to the policy
    policy1.addServicePrincipal('ec2.amazonaws.com');

    // 👇 create a role with an AWS Account principal
    const role2 = new iam.Role(this, 'role-2', {
      assumedBy: new iam.AccountPrincipal(cdk.Stack.of(this).account),
    });

    // 👇 create a role with an Account Root Principal
    const role3 = new iam.Role(this, 'role-3', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // 👇 create a role with an ARN Principal
    // const role4 = new iam.Role(this, 'role-4', {
    //   assumedBy: new iam.ArnPrincipal(
    //     `arn:aws:iam::${cdk.Stack.of(this).account}:user/YOUR_USER_NAME`,
    //   ),
    // });

    // 👇 create a policy with Any Principal
    const policy2 = new iam.PolicyStatement({
      resources: ['*'],
      actions: ['s3:*'],
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
    });

    // 👇 create a role with PrincipalWithConditions
    const role4 = new iam.Role(this, 'role-4', {
      assumedBy: new iam.PrincipalWithConditions(
        new iam.AccountRootPrincipal(),
        {
          Bool: {
            'aws:MultiFactorAuthPresent': true,
            'aws:SecureTransport': true,
          },
          NumericLessThan: {
            'aws:MultiFactorAuthAge': 300,
          },
        },
      ),
    });

    // 👇 create a role with WebIdentityPrincipal
    // const role5 = new iam.Role(this, 'role-5', {
    //   assumedBy: new iam.WebIdentityPrincipal(
    //     'cognito-identity.amazonaws.com',
    //     {
    //       StringEquals: {
    //         'cognito-identity.amazonaws.com:aud': identityPool.ref,
    //       },
    //       'ForAnyValue:StringLike': {
    //         'cognito-identity.amazonaws.com:amr': 'authenticated',
    //       },
    //     },
    //   ),
    // });

    // 👇 create a role with FederatedPrincipal
    // const role6 = new iam.Role(this, 'role-6', {
    //   assumedBy: new iam.FederatedPrincipal(
    //     'cognito-identity.amazonaws.com',
    //     {
    //       StringEquals: {
    //         'cognito-identity.amazonaws.com:aud': identityPool.ref,
    //       },
    //       'ForAnyValue:StringLike': {
    //         'cognito-identity.amazonaws.com:amr': 'authenticated',
    //       },
    //     },
    //     'sts:AssumeRoleWithWebIdentity',
    //   ),
    // });

    // 👇 create a role with an OrganizationPrincipal
    const role7 = new iam.Role(this, 'role-7', {
      assumedBy: new iam.OrganizationPrincipal('o-123asdf'),
    });
  }
}
