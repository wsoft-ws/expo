#!/bin/sh
curl -sSL https://dot.net/v1/dotnet-install.sh > dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh -c 9.0 -InstallDir ./dotnet
./dotnet/dotnet --version
./dotnet/dotnet workload install wasm-tools --skip-manifest-update
./dotnet/dotnet publish -c Release -o site WSOFT.Expo.WebUI/WSOFT.Expo.WebUI.csproj
