import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "DjangoVpc", { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, "DjangoCluster", { vpc });

    const certificateArn =
      "arn:aws:acm:us-east-1:019749023127:certificate/1d721b27-f985-49d9-a67b-199c7edfa002";
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      certificateArn
    );

    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "DjangoService",
        {
          cluster,
          desiredCount: 1,
          taskImageOptions: {
            environment: {
              DEBUG: "1",
              DJANGO_ALLOWED_HOSTS: "*",
              SECRET_KEY: process.env.SECRET_KEY ?? "super-secret",
              DB_USER: process.env.DB_USER ?? "lguibr",
              DB_PASSWORD: process.env.DB_PASSWORD ?? "lguibr",
            },
            image: ecs.ContainerImage.fromRegistry(
              "lguibr/django-trellis-example:latest"
            ),
            containerPort: 8000,
          },
          publicLoadBalancer: true,
        }
      );

    // HTTPS listener with default action to forward to the ECS service's target group
    const httpsListener = fargateService.loadBalancer.addListener(
      "HttpsListener",
      {
        port: 443,
        certificates: [certificate],
        open: true,
      }
    );
    httpsListener.addTargets("EcsServiceTarget", {
      port: 80,
      targets: [fargateService.service],
    });

    // Output the HTTPS URL of the load balancer
    new cdk.CfnOutput(this, "LoadBalancerHTTPSURL", {
      value: `https://${fargateService.loadBalancer.loadBalancerDnsName}`,
      description: "URL to access the Django application via HTTPS",
    });
    
  }
}

const app = new cdk.App();
new InfraStack(app, "DjangoAppStack", {
  env: {
    account: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  },
});
app.synth();
