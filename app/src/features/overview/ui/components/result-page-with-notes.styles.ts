import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
    notesDropdown: {},
    noResultsContainer: {
        width: '100%',
        padding: '5%',
        alignItems: 'center',
        display: 'flex',
    },
    noResultsTitle: {
        fontSize: '1.5rem',
        fontFamily: 'Poppins',
        marginBottom: '0.5rem',
        marginTop: '15%',
        fontWeight: '700',
        color: '$textColor',
    },
    noResultsSubTitle: {
        fontSize: '1.2rem',
        fontWeight: '500',
        color: '$purpleColor',
        textAlign: 'center',
    },
    list: {
        minWidth: '100%',
        height: '100%',
    },
    link: {
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
})
