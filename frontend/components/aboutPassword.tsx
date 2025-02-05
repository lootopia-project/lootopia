import {View, Text} from 'react-native';
import { useLanguage } from "@/hooks/providers/LanguageProvider"

const AboutPassword = (checkPassword:{length: boolean, maj: boolean, min: boolean, special: boolean, same: boolean}) => {
    const { i18n } = useLanguage();
    return (
        <View>
            <Text style={checkPassword.length ? styles.validText : styles.errorText}>{i18n.t("At least 10 characters")}</Text>
            <Text style={checkPassword.maj ? styles.validText : styles.errorText}>{i18n.t("At least one uppercase letter")}</Text>
            <Text style={checkPassword.min ? styles.validText : styles.errorText}>{i18n.t("At least one lowercase letter")}</Text>
            <Text style={checkPassword.special ? styles.validText : styles.errorText}>{i18n.t("At least one special character")}</Text>
            <Text style={checkPassword.same ? styles.validText : styles.errorText}>{i18n.t("Same password")}</Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    passwordValidation: {
        marginTop: 10,
    },
    validText: {
        color: 'green',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
  };

  export default AboutPassword;