import { UILogic, UIEvent, IncomingUIEvent, UIMutation } from 'ui-logic-core'

import { UITaskState, UIServices, NavigationProps } from 'src/ui/types'
import { executeUITask, loadInitial } from 'src/ui/utils'
import { storageKeys } from '../../../../../../app.json'

export interface State {
    loadState: UITaskState
    isSynced: boolean
    syncState: UITaskState
}

export type Event = UIEvent<{
    setSyncStatus: { value: boolean }
    syncNow: {}
}>

export interface Props extends NavigationProps {
    services: UIServices<'localStorage' | 'sync' | 'errorTracker'>
}

export default class Logic extends UILogic<State, Event> {
    constructor(private props: Props) {
        super()
    }

    getInitialState(): State {
        return { isSynced: false, syncState: 'pristine', loadState: 'pristine' }
    }

    async init(incoming: IncomingUIEvent<State, Event, 'init'>) {
        await loadInitial<State>(this, async () => {
            const { localStorage } = this.props.services

            if (await localStorage.get(storageKeys.syncKey)) {
                this.emitMutation({ isSynced: { $set: true } })
            }
        })
    }

    setSyncStatus(
        incoming: IncomingUIEvent<State, Event, 'setSyncStatus'>,
    ): UIMutation<State> {
        return { isSynced: { $set: incoming.event.value } }
    }

    async syncNow(incoming: IncomingUIEvent<State, Event, 'syncNow'>) {
        return executeUITask(this, 'syncState', async () => {
            await this.props.services.sync.continuousSync
                .forceIncrementalSync()
                .catch(err => this.props.services.errorTracker.track(err))
        })
    }
}
