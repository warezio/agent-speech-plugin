#!/bin/bash

# Test script for marketplace distribution
# This script tests the marketplace setup locally

echo "🧪 Testing agent-speech-plugin marketplace setup..."

# Check if marketplace.json exists
if [ ! -f ".claude-plugin/marketplace.json" ]; then
    echo "❌ marketplace.json not found"
    exit 1
fi

# Check if plugin.json exists
if [ ! -f ".claude-plugin/agent-speech-plugin/plugin.json" ]; then
    echo "❌ plugin.json not found"
    exit 1
fi

# Check if MCP config exists
if [ ! -f ".claude-plugin/agent-speech-plugin/.mcp.json" ]; then
    echo "❌ .mcp.json not found"
    exit 1
fi

# Check if README exists
if [ ! -f ".claude-plugin/agent-speech-plugin/README.md" ]; then
    echo "❌ README.md not found"
    exit 1
fi

# Check if dist/mcp-server.js exists (after build)
if [ ! -f "dist/mcp-server.js" ]; then
    echo "❌ dist/mcp-server.js not found. Run 'pnpm build' first."
    exit 1
fi

# Check package.json includes .claude-plugin
if ! grep -q "\.claude-plugin" package.json; then
    echo "❌ package.json doesn't include .claude-plugin in files array"
    exit 1
fi

# Check version consistency
PACKAGE_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
MARKETPLACE_VERSION=$(grep -o '"version": "[^"]*"' .claude-plugin/marketplace.json | head -1 | cut -d'"' -f4)
PLUGIN_VERSION=$(grep -o '"version": "[^"]*"' .claude-plugin/agent-speech-plugin/plugin.json | cut -d'"' -f4)

if [ "$PACKAGE_VERSION" = "$MARKETPLACE_VERSION" ] && [ "$PACKAGE_VERSION" = "$PLUGIN_VERSION" ]; then
    echo "✅ Version consistency: v$PACKAGE_VERSION"
else
    echo "❌ Version mismatch:"
    echo "   package.json: $PACKAGE_VERSION"
    echo "   marketplace.json: $MARKETPLACE_VERSION"
    echo "   plugin.json: $PLUGIN_VERSION"
    exit 1
fi

echo "✅ All marketplace files present and consistent"
echo "✅ Ready for marketplace distribution!"

# Show installation commands
echo ""
echo "To install from marketplace:"
echo "  claude plugin marketplace add warezio https://github.com/warezio/agent-speech-plugin"
echo "  claude plugin install agent-speech-plugin"

echo ""
echo "To create a release:"
echo "  ./scripts/release.sh 0.2.0"