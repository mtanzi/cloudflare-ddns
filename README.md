# Cloudflare DDNS

A TypeScript-based Dynamic DNS (DDNS) solution that automatically updates your Cloudflare DNS records with your current public IP address.

## Features

- Automatic IP address detection
- Cloudflare API integration
- Docker support
- TypeScript implementation with modern tooling
- Comprehensive testing setup
- Environment-based configuration

## Prerequisites

- Node.js (version specified in [.nvmrc](cci:7://file:///Users/mtanzi/Projects/typescript/cloudflare-ddns/.nvmrc:0:0-0:0))
- Docker (optional, for container deployment)
- Cloudflare API token with DNS edit permissions

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd cloudflare-ddns
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Configuration

Create a `.env` file with the following variables:

```env
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ZONE_ID=your_zone_id
DNS_RECORD_NAME=your_subdomain
DNS_RECORD_TYPE=A
```

Example configuration:

```env
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here
DNS_RECORD_NAME=home.example.com
DNS_RECORD_TYPE=A
```

## Running the Application

### Development

```bash
npm run dev
# or
yarn dev
```

### Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Docker

```bash
docker-compose up
```

## Testing

Run tests with coverage:

```bash
npm test:coverage
# or
yarn test:coverage
```

## Project Structure

- `src/` - Source code
- `dist/` - Compiled JavaScript
- `tests/` - Test files
- `docker/` - Docker configuration
- `coverage/` - Test coverage reports

## Platform-Specific Setup Instructions

### Raspberry Pi

1. Install Node.js 22.9.0:

```bash
# Install NodeSource repository
sudo curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
```

2. Clone and install the application:

```bash
# Clone the repository
sudo mkdir -p /opt/cloudflare-ddns
sudo git clone [repository-url] /opt/cloudflare-ddns

# Install dependencies
sudo npm install --production
sudo npm run build
```

3. Configure environment:

```bash
sudo mkdir -p /etc
sudo cp .env.production /etc/cloudflare-ddns.env
```

4. Set up systemd service:

```bash
# Copy service file
sudo cp service/systemd/cloudflare-ddns.service /etc/systemd/system/

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-ddns

# Start service
sudo systemctl start cloudflare-ddns
```

5. Verify status:

```bash
sudo systemctl status cloudflare-ddns
```

### Ubuntu Linux

1. Install Node.js 22.9.0:

```bash
# Install NodeSource repository
sudo curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
```

2. Clone and install the application:

```bash
# Clone repository
mkdir -p ~/cloudflare-ddns
git clone [repository-url] ~/cloudflare-ddns

cd ~/cloudflare-ddns
npm install --production
npm run build
```

3. Configure environment:

```bash
# Copy production environment
mkdir -p ~/.config/cloudflare-ddns
cp .env.production ~/.config/cloudflare-ddns/env
```

4. Set up systemd service:

```bash
# Copy service file
sudo cp cloudflare-ddns.service /etc/systemd/system/

# Edit service file to point to user directory
sudo sed -i 's/WorkingDirectory=\/opt\/cloudflare-ddns/WorkingDirectory=\$HOME\/cloudflare-ddns/' /etc/systemd/system/cloudflare-ddns.service
sudo sed -i 's/EnvironmentFile=\/etc\/cloudflare-ddns.env/EnvironmentFile=\$HOME\/\.config\/cloudflare-ddns\/env/' /etc/systemd/system/cloudflare-ddns.service
sudo sed -i 's/User=pi/User=\$USER/' /etc/systemd/system/cloudflare-ddns.service

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-ddns

# Start service
sudo systemctl start cloudflare-ddns
```

5. Verify status:

```bash
systemctl --user status cloudflare-ddns
```

### macOS

1. Install Node.js 22.9.0:

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@22

# Link Node.js
brew link --force --overwrite node@22

# Verify installation
node --version
```

2. Clone and install the application:

```bash
# Clone repository
mkdir -p ~/cloudflare-ddns
git clone [repository-url] ~/cloudflare-ddns

cd ~/cloudflare-ddns
npm install --production
npm run build
```

3. Configure environment:

```bash
# Copy production environment
mkdir -p ~/Library/Application\ Support/cloudflare-ddns
cp .env.production ~/Library/Application\ Support/cloudflare-ddns/env
```

4. Set up launchd service:

```bash
# Copy plist file
mkdir -p ~/Library/LaunchAgents
cp service/launchd/cloudflare-ddns.plist ~/Library/LaunchAgents/

# Load and start service
launchctl load ~/Library/LaunchAgents/cloudflare-ddns.plist
launchctl start ~/Library/LaunchAgents/cloudflare-ddns.plist
```

5. Verify status:

```bash
launchctl list | grep cloudflare-ddns
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mtanzi/cloudflare-ddns/blob/main/LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

Please report any security vulnerabilities by contacting the maintainers directly.

## Support

For support, please open an issue in the GitHub repository.
