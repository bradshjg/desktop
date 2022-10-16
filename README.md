# [GitHub Desktop -- Virtual Repos](https://desktop.github.com)

[GitHub Desktop](https://github.com/desktop/desktop) fork with experimental support for "virtual repos".

## Virtual Repos???

Virtual repos tries to capture the idea of a git repository that exists on an external filesystem.

This could be used when:

* Editing code over an SSH connection
* Using GitHub Codespaces

### Configuring a virtual repo

Currently only `ssh`-based virtual repos are supported.

When adding a virtual repo, use

`ssh::<host>::<repo-path>`, e.g. `ssh::cs::/workspaces/desktop`

Where in this case `~/.ssh/config` includes

```
Host cs
  User codespace
  Hostname localhost
  Port 2222
  NoHostAuthenticationForLocalhost yes
  StrictHostKeyChecking no
  ControlMaster auto
  ControlPath ~/.ssh/ssh-%r@%h:%p
  ControlPersist 60m
```

It _must_ be the case that `ssh cs` (in this case) logs in without any need for user input, as this
is how commands are run on the remote host. To verify your config you can use:

`ssh cs echo howdy`

and ensure that `howdy` is returned without a password prompt or similar.

> N.B. The `ControlMaster`, `ControlPath`, `ControlPersist` sections allow multiplexing commands over
> a single TCP connection, vastly improving the usability!

## Release Process

Currently a bit of a mess, but here it is:

1. `yarn build:prod`
2. `yarn package`
2. Follow [DMG build instructions](https://support.apple.com/guide/disk-utility/create-a-disk-image-dskutl11888/mac).

Attach the generated DMG file to the release.

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
