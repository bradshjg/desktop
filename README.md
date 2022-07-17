# [GitHub Desktop -- Virtual Repos](https://desktop.github.com)

<<<<<<< HEAD
[GitHub Desktop](https://github.com/desktop/desktop) fork with experimental support for "virtual repos".
=======
[GitHub Desktop](https://desktop.github.com/) is an open source [Electron](https://www.electronjs.org/)-based
GitHub app. It is written in [TypeScript](https://www.typescriptlang.org) and
uses [React](https://reactjs.org/).
>>>>>>> 7c45f0e7c4bf0fb96c1f2b19bbf9471a7f1a245c

## Virtual Repos???

Virtual repos tries to capture the idea of a git repository that exists on an external filesystem.

This could be used when:

* Editing code over an SSH connection
* Using GitHub Codespaces

There are some pretty strong requirements for this to work, however. The most important being this only
implements the client side of the virtual repos, and the
[server side](https://github.com/bradshjg/gh-desktop-virtual-repo-server) (also available as a
[VS code extension](https://github.com/bradshjg/gh-desktop-virtual-repo-server-extension)) must be running on the
remote server (and the port `localhost:9195` must be resolve to that remote Node process...which can be a lot).

<<<<<<< HEAD
For example, to get this working over an SSH connection we'd need:

* A Node runtime on the remote server, and the server process running (and the build tools to build it, for now).
* A tunnel from `localhost:9195` to that remote Node process (e.g. using an SSH tunnel)
=======
Linux is not officially supported; however, you can find installers created for Linux from a fork of GitHub Desktop in the [Community Releases](https://github.com/desktop/desktop#community-releases) section.

**NOTE**: There is no current migration path to import your existing
repositories into the new application - you can drag-and-drop your repositories
from disk onto the application to get started.


### Beta Channel
>>>>>>> 7c45f0e7c4bf0fb96c1f2b19bbf9471a7f1a245c

In GitHub Codespaces, it's _slightly_ simplified:

* Install the [extension](https://github.com/bradshjg/gh-desktop-virtual-repo-server-extension) and then run
  "GitHub Desktop: Start virtual repo server" which will launch the process and set up port forwarding.

The interface for adding a virtual repo is to use the path to the git repository on the remote file system. For
example if I'm working in a GitHub Codespace it might be something like `/workspaces/my-repo`.

## Release Process

Currently a bit of a mess, but here it is:

1. `yarn build:prod`
2. `yarn package`
2. Follow [DMG build instructions](https://support.apple.com/guide/disk-utility/create-a-disk-image-dskutl11888/mac).

Attach the generated DMG file to the release.


See our [getting started documentation](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/overview/getting-started-with-github-desktop) for more information on how to set up, authenticate, and configure GitHub Desktop.

## License

**[MIT](LICENSE)**

The MIT license grant is not for GitHub's trademarks, which include the logo
designs. GitHub reserves all trademark and copyright rights in and to all
GitHub trademarks. GitHub's logos include, for instance, the stylized
Invertocat designs that include "logo" in the file title in the following
folder: [logos](app/static/logos).

GitHub® and its stylized versions and the Invertocat mark are GitHub's
Trademarks or registered Trademarks. When using GitHub's logos, be sure to
follow the GitHub [logo guidelines](https://github.com/logos).
