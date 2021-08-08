# [GitHub Desktop -- Virtual Repos](https://desktop.github.com)

[GitHub Desktop](https://github.com/desktop/desktop) fork with experimental support for "virtual repos".

## Virtual Repos???

Virtual repos tries to capture the idea of a git repository that exists on an external filesystem.

This could be used when:

* Editing code over an SSH connection
* Using GitHub Codespaces

There are some pretty strong requirements for this to work, however. The most important being this only
implements the client side of the virtual repos, and the
[server side](https://github.com/bradshjg/gh-desktop-virtual-repo-server) (also available as a
[VS code extension](https://github.com/bradshjg/gh-desktop-virtual-repo-server-extension)) must be running on the
remote server (and the port `localhost:9195` must be resolve to that remove server...which can be a lot).

For example, to get this working over an SSH connection we'd need:

* A Node runtime on the remote server, and the server process running.
* A tunnel from `localhost:9195` to that remote Node process (e.g. using an SSH tunnel)

In GitHub Codespaces, it's _slightly_ simplified:

* Install the [extension](https://github.com/bradshjg/gh-desktop-virtual-repo-server-extension) and then run
  "GitHub Desktop: Start virtual repo server" which will launch the process and set up port forwarding.

The interface for adding a virtual repo is to use the path to the git repository on the remote file system. For
example if I'm working in a GitHub Codespace it might be something like `/workspaces/my-repo`.

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
