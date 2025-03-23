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
    ranking: number;
    crowns: number;
}

export default InfoEditUser;
