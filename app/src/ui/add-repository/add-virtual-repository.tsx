import * as React from 'react'

import { Dispatcher } from '../dispatcher'
import { TextBox } from '../lib/text-box'
import { Row } from '../lib/row'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'

interface IAddVirtualRepositoryProps {
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void

  /** An optional path to prefill the path text box with.
   * Defaults to the empty string if not defined.
   */
  readonly path?: string
}

interface IAddVirtualRepositoryState {
  readonly path: string
}

/** The component for adding a virtual repository. */
export class AddVirtualRepository extends React.Component<
  IAddVirtualRepositoryProps,
  IAddVirtualRepositoryState
> {
  public constructor(props: IAddVirtualRepositoryProps) {
    super(props)

    const path = this.props.path ? this.props.path : ''

    this.state = {
      path,
    }
  }

  public render() {
    const disabled =
      this.state.path.length === 0

    return (
      <Dialog
        id="add-virtual-repository"
        title='Add virtual repository'
        onSubmit={this.addRepository}
        onDismissed={this.props.onDismissed}
      >
        <DialogContent>
          <Row>
            <TextBox
              value={this.state.path}
              label='Remote path'
              placeholder="repository path"
              onValueChanged={this.onPathChanged}
            />
          </Row>
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={__DARWIN__ ? 'Add Repository' : 'Add repository'}
            okButtonDisabled={disabled}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onPathChanged = async (path: string) => {
    this.setState({ path })
  }

  private addRepository = async () => {
    this.props.onDismissed()
    const { dispatcher } = this.props

    const repositories = await dispatcher.addRepositories([`virtual://${this.state.path}`])

    if (repositories.length > 0) {
      dispatcher.selectRepository(repositories[0])
      dispatcher.recordAddVirtualRepository()
    }
  }
}
