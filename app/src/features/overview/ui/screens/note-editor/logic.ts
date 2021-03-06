import { Alert } from 'react-native'

import { UILogic, UIEvent, IncomingUIEvent, UIMutation } from 'ui-logic-core'
import { NavigationProps, UIStorageModules, UITaskState } from 'src/ui/types'
import { executeUITask } from 'src/ui/utils'

export interface State {
    noteText: string
    highlightText: string | null
    highlightTextLines?: number
    showAllText: boolean
    saveState: UITaskState
}

export type Event = UIEvent<{
    goBack: {}
    saveNote: {}
    changeNoteText: { value: string }
    setHighlightTextLines: { lines: number }
    setShowAllText: { show: boolean }
}>

export interface Props extends NavigationProps {
    storage: UIStorageModules<'metaPicker' | 'pageEditor'>
}

export default class Logic extends UILogic<State, Event> {
    static HIGHLIGHT_MAX_LINES = 4

    pageUrl: string
    noteUrl?: string
    mode: 'create' | 'update'
    initNoteText: string
    selectedList: string

    constructor(private props: Props) {
        super()

        this.mode = props.navigation.getParam('mode', 'update')
        this.pageUrl = props.navigation.getParam('pageUrl')
        this.noteUrl = props.navigation.getParam('noteUrl')
        this.initNoteText = props.navigation.getParam('noteText', '')
        this.selectedList = props.navigation.getParam('selectedList')
    }

    getInitialState(): State {
        const noteText = this.props.navigation.getParam('noteText', '')
        const highlightText = this.props.navigation.getParam(
            'highlightText',
            null,
        )

        return {
            noteText,
            highlightText,
            showAllText: false,
            saveState: 'pristine',
        }
    }

    private navigateBack = () =>
        this.props.navigation.navigate('PageEditor', {
            mode: 'notes',
            pageUrl: this.pageUrl,
            selectedList: this.selectedList,
        })

    goBack({ previousState }: IncomingUIEvent<State, Event, 'goBack'>) {
        if (previousState.noteText?.trim() !== this.initNoteText.trim()) {
            Alert.alert('Discard Changes?', `You've made unsaved changes`, [
                {
                    text: 'Discard',
                    onPress: this.navigateBack,
                },
                { text: 'Continue' },
            ])
        } else {
            this.navigateBack()
        }
    }

    changeNoteText(
        incoming: IncomingUIEvent<State, Event, 'changeNoteText'>,
    ): UIMutation<State> {
        return {
            noteText: { $set: incoming.event.value },
        }
    }

    async saveNote({
        previousState: state,
    }: IncomingUIEvent<State, Event, 'saveNote'>) {
        const { pageEditor } = this.props.storage.modules

        await executeUITask<State, 'saveState', void>(
            this,
            'saveState',
            async () => {
                if (this.mode === 'create') {
                    return pageEditor.createNote({
                        pageUrl: this.pageUrl,
                        comment: state.noteText,
                        pageTitle: '',
                    })
                } else {
                    return pageEditor.updateNoteText({
                        url: this.noteUrl!,
                        text: state.noteText,
                    })
                }
            },
        )

        this.navigateBack()
    }

    setHighlightTextLines(
        incoming: IncomingUIEvent<State, Event, 'setHighlightTextLines'>,
    ): UIMutation<State> {
        return {
            highlightTextLines: { $set: incoming.event.lines },
        }
    }

    setShowAllText(
        incoming: IncomingUIEvent<State, Event, 'setShowAllText'>,
    ): UIMutation<State> {
        return {
            showAllText: {
                $set: incoming.event.show,
            },
        }
    }
}
