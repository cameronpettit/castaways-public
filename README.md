# Castaways FC Website

A modern, responsive website for the Castaways Football Club built with Angular and deployed on AWS CloudFront.

## 🏆 About

The Castaways Football Club website showcases our community-based soccer club that has been serving the Victoria area for over 50 years. The site features team information, schedules, results, and club history.

## 🛠️ Technology Stack

- **Frontend**: Angular 18+ with TypeScript
- **Styling**: Bootstrap 5 + Custom SCSS
- **Fonts**: Google Fonts (Orbitron, Rajdhani, Roboto Condensed)
- **Icons**: Bootstrap Icons
- **Deployment**: AWS CloudFront + S3
- **Infrastructure**: AWS CDK (Cloud Development Kit)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your computer:

### Required Software:
1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - This includes npm (Node Package Manager)

2. **Git**
   - Download from: https://git-scm.com/
   - For version control and downloading the project

3. **AWS CLI** (for deployment)
   - Download from: https://aws.amazon.com/cli/
   - For interacting with AWS services

4. **Angular CLI**
   - Install globally after Node.js: `npm install -g @angular/cli`

### AWS Account Setup:

To make changes to the AWS account, you will need access via an IAM account. Contact the [Castaways Webmaster](mailto:webmaster@castawaysfc.org) to request an account.

## 🚀 Getting Started - Running Locally

### Step 1: Clone the Repository

```bash
# Open your terminal/command prompt and run:
git clone https://github.com/cameronpettit/castaways-public.git

# Navigate to the project folder:
cd castaways-public
```

### Step 2: Install Dependencies

```bash
# Install all required packages:
npm install

# This may take a few minutes as it downloads all dependencies
```

### Step 3: Start the Development Server

```bash
# Start the local development server:
ng serve

# Alternative command:
npm start
```

### Step 4: View the Website

1. Open your web browser
2. Go to: `http://localhost:4200`
3. The website should load automatically
4. Any changes you make to the code will automatically refresh the page

### Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Generate new components
ng generate component component-name

# Check for linting errors
ng lint
```

## 🌐 Deployment to AWS CloudFront

### Prerequisites for Deployment

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Must be installed and configured
3. **Permissions**: Your AWS user needs CloudFront, S3, and CDK permissions

### Step 1: Configure AWS Credentials

#### Option A: Using AWS CLI
```bash
# Configure your AWS credentials
aws configure

# You'll be prompted to enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-west-2)
# - Default output format (json)
```

#### Option B: Using Environment Variables
```bash
# Set environment variables (replace with your actual values)
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_DEFAULT_REGION=ca-central-1
```

### Step 2: Install AWS CDK

```bash
# Install AWS CDK globally
npm install -g aws-cdk

# Verify installation
cdk --version
```

### Step 3: Bootstrap CDK (First Time Only)

```bash
# Bootstrap your AWS environment for CDK
cdk bootstrap

# This sets up the necessary resources for CDK in your AWS account
```

### Step 4: Build the Application

```bash
# Build the Angular application for production
ng build --configuration production

# This creates a 'dist' folder with optimized files
```

### Step 5: Deploy to AWS

```bash
# Deploy the infrastructure and website
cdk deploy

# You'll see a progress indicator and may be asked to confirm changes
# Type 'y' when prompted to approve the deployment
```

### Step 6: Get Your Website URL

After deployment completes:
1. Check the terminal output for the CloudFront URL
2. Or go to AWS Console → CloudFront → Distributions
3. Find your distribution and copy the domain name
4. Your website will be available at: `https://your-distribution-id.cloudfront.net` or `https://castwaysfc.org`

## 📁 S3 Bucket Synchronization

### Understanding the S3 Setup

Your website files are stored in an S3 bucket and served through CloudFront for better performance and security.

When you make changes to the GitHub codebase, you need to push these changes to S3 so CloudFront can find them.

### Manual S3 Sync Commands

```bash
# Name S3 bucket
export CASTAWAYS_FC_DIST_BUCKET=castaways-public

# Build dist
yarn build

# Remove existing dist from the bucket
aws s3 rm s3://$CASTAWAYS_FC_DIST_BUCKET/ --recursive --exclude "*" --include "latest/*"

# Sync local build files to S3 bucket
aws s3 sync dist s3://$CASTAWAYS_FC_DIST_BUCKET/latest
```

### Automated Deployment

This repo will automatically build and deploy to the correct AWS remote environment whenever changes are merged with the `master` branch.

In GitHub Settings/Environments, make sure the following secrets are set correctly:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

Make sure the following variables are set correctly:

```
CASTAWAYS_FC_DIST_BUCKET
```

You can generate access keys by logging in to the AWS remote console and creating an IAM role with permissions to access S3, then generating keys for that role.

There should already be a role in the AWS remote console called `github_actions` that has been given the correct permissions.

If you need to cycle the access key id and secret access key, delete the old keys and regenerate new ones. Then replace the keys in GitHub Actions -> Secrets.

### Finding Your S3 Bucket Name

1. Go to AWS Console → S3
2. Look for a bucket with a name like: `castawaysfcsitestack-websitebucket-xxxxx`
3. Or check the CDK output after deployment

### Finding Your CloudFront Distribution ID

1. Go to AWS Console → CloudFront
2. Find your distribution in the list
3. Copy the ID (format: E1234567890ABC)

## 🔧 Configuration Files

### Important Files to Know:

- `package.json` - Project dependencies and scripts
- `angular.json` - Angular CLI configuration
- `src/styles.scss` - Global styles and color scheme
- `cdk.json` - CDK configuration
- `lib/castawaysfc-site-stack.js` - AWS infrastructure definition

### Environment Configuration:

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
```

## 🎨 Customization

### Changing Colors:
Edit `src/styles.scss`:
```scss
$primary: #152D53;     // Dark blue
$secondary: #485D84;   // Medium blue
$info: #90D7FF;        // Light blue
$success: #A0EEC0;     // Light green
$warning: #FED234;     // Yellow
$danger: #FE5F55;      // Red
```

### Adding New Pages:
```bash
# Generate a new component
ng generate component pages/new-page

# Add routing in src/app/app.routes.ts
```

## 🐛 Troubleshooting

### Common Issues:

#### "Node.js version not supported"
```bash
# Check your Node.js version
node --version

# Update to Node.js 18+ if needed
```

#### "AWS credentials not found"
```bash
# Verify AWS configuration
aws configure list

# Re-configure if needed
aws configure
```

#### "CDK command not found"
```bash
# Install CDK globally
npm install -g aws-cdk
```

#### "Build fails"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "CloudFront not updating"
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Getting Help:

1. Check the terminal output for specific error messages
2. Ensure all prerequisites are installed
3. Verify AWS permissions and credentials
4. Check Angular documentation: https://angular.io/docs
5. Check AWS CDK documentation: https://docs.aws.amazon.com/cdk/

## 📝 Development Workflow

### Making Changes:
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test locally: `ng serve`
4. Build for production: `ng build`
5. Deploy: `cdk deploy`
6. Create pull request when ready

### File Structure:
```
castaways-public/
├── src/
│   ├── app/
│   │   ├── header/          # Header component
│   │   ├── sidebar/         # Sidebar component
│   │   ├── home/           # Home page
│   │   ├── pages/          # Other pages
│   │   └── services/       # Angular services
│   ├── assets/             # Images, fonts, etc.
│   └── styles.scss         # Global styles
├── lib/                    # CDK infrastructure code
├── cdk.out/               # CDK build output
└── dist/                  # Angular build output
```

## 📊 Performance Tips

1. **Images**: Optimize images before adding to `src/assets/images/`
2. **Caching**: CloudFront automatically caches content
3. **Bundle Size**: Use `ng build --stats-json` to analyze bundle size
4. **Lazy Loading**: Implement for large components

## 🔐 Security

1. **Never commit**: AWS credentials, API keys, or sensitive data
2. **Use environment variables**: For configuration
3. **IAM permissions**: Follow principle of least privilege
4. **HTTPS**: Always enforced through CloudFront

## 📞 Support

For questions or issues:
1. Check this README first
2. Look at existing GitHub issues
3. Create a new issue with detailed description
4. Include error messages and steps to reproduce

---

**Made with ⚽ by Castaways FC**
