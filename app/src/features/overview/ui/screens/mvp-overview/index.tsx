import React from 'react'
import { View, Text, Linking } from 'react-native'

import { version, storageKeys } from '../../../../../../app.json'
import EmptyLayout from 'src/ui/layouts/empty'
import Button from 'src/ui/components/memex-btn'
import { NavigationScreen } from 'src/ui/types'
import Logic, { State, Event } from './logic'
import styles from './styles'

interface Props {}

export default class MVPOverviewMenu extends NavigationScreen<
    Props,
    State,
    Event
> {
    constructor(props: Props) {
        super(props, { logic: new Logic() })
    }

    componentDidMount() {
        this.navToOnboardingIfNeeded()
    }

    private async navToOnboardingIfNeeded() {
        const showOnboarding = await this.props.services.localStorage.get<
            boolean
        >(storageKeys.showOnboarding)

        if (showOnboarding || showOnboarding === null) {
            this.props.navigation.navigate('Onboarding')
        }
    }

    private handleTutorialPress = () =>
        this.props.navigation.navigate('Onboarding')

    private handleRoadmapPress = () => Linking.openURL('https://worldbrain.io')

    private handleBugReportPress = () =>
        Linking.openURL('https://worldbrain.io')

    render() {
        return (
            <EmptyLayout>
                <View style={styles.mainContent}>
                    <View style={styles.memexLogo} />
                    <View style={styles.btnsContainer}>
                        <Button
                            title="View Tutorial"
                            onPress={this.handleTutorialPress}
                            style={styles.btn}
                        />
                        <Button
                            title="Feature Roadmap"
                            onPress={this.handleRoadmapPress}
                            style={styles.btn}
                        />
                        <Button
                            title="Report Bugs"
                            onPress={this.handleBugReportPress}
                            style={styles.btn}
                        />
                    </View>
                </View>
                <Text style={styles.versionText}>Version {version}</Text>
            </EmptyLayout>
        )
    }
}