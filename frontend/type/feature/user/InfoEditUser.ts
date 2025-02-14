interface InfoEditUser{
    id: number;
    email: string;
    name: string;
    surname: string;
    isPartner: boolean;
    img: string;
    nickname: string;
    isTwoFactorEnabled: boolean;
    phone: number;
    lang: string;
    checkMail: boolean;
}

export default InfoEditUser;
