class StatusEnum {
    static Rejected = 0;
    static Applied = 1;
    static FollowUp = 2;
    static Interviewing = 3;
    static Offer = 4;

    static isValidStatus(status) {
        return Object.values(StatusEnum).includes(status);
    }

    static getStatusText(status) {
        switch (status) {
            case StatusEnum.Rejected:
                return "Rejected";
            case StatusEnum.Applied:
                return "Applied";
            case StatusEnum.FollowUp:
                return "Follow Up";
            case StatusEnum.Interviewing:
                return "Interviewing";
            case StatusEnum.Offer:
                return "Offer";
            default:
                return "Unknown Status";
        }
    }

    static getAllStatus() {
        return Object.values(StatusEnum);
    }
}

module.exports = {
    StatusEnum
};