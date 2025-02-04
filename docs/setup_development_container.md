# Setup Development Container environment

With many thanks to this [brilliant article](https://dev.to/simplifycomplexity/solving-hot-reload-issues-in-vs-code-dev-containers-on-windows-with-wsl2-16d5) from Kiran Randhawa.

I have worked years with Developent Containers using only Docker. Recently I started working with WSL integration. Not only my Hot Reload issue is solved, the performance gain is staggering.

If you have never setup this before, in Windows 11:

1. Run Powershell as Admin, and run

```Powershell
wsl --install
```

2. Start the Microsoft Store - type "store" in your taskbar, and search for "Ubuntu", I installed "Ubuntu 20.04.6 LTS" (Debian did not work for me);
3. Start Ubuntu, create your account;
4. Create a `repos` folder and withing this folder, clone this repository;
5. Install [Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/);
6. In docker desktop, open the settings with the cog-wheel icon;
7. Section "General", check "Use the WSL 2 based engine" and the sub-option "Add the \*.docker.internal names..."
8. Section "Resources | WSL integration", enable the switch for Ubuntu, this comes with the Ubuntu installation. Press button "Apply and Restart"
9. Start VS Code, and with the blue button at the left bottom, connect to WSL with distribution, choose Ubuntu;
10. Choose folder `repos` and then the subfolder with this repositor;
11. When asked, press the button "Open folder in Dev Container";
12. After opening in Dev Container, the environment will install all prerequisites to run this repository;

Ready to go!

The installed environment includes:

- Node with Typescript;
- Terraform;
- AWS CLI;

Tip!
Install the "Draw.io Integration" plugin from Henning Dieterichs to view `.drawio` files.
