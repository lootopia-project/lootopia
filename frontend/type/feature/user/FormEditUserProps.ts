import FormEditUser from './FormEditUser';
interface FormEditUserProps  {
    infoEditUser: FormEditUser;
    handleChange: (name: keyof FormEditUser, value: string | boolean) => void;
    handleFileChange: () => void;
    setModalVisible: (visible: boolean) => void;
    submit: () => void;
}

export default FormEditUserProps;