type ErrorResponse = {
  Error: {
    Status: string;
    Title: string;
    Detail: string;
    MulitiDetail: any;
  };
};

type PunchResponse = {
  Data: {
    AttendanceHistoryId: string;
    punchDate: number;
    punchType: number;
    LocationName: string;
    Note: string;
    clientIp: any;
    CanOverride: boolean;
    OverrideMessage: string;
  };
};

type LocationResponse = {
  Data: {
    PunchesLocationId: string;
    LocationCode: string;
    LocationName: string;
    Latitude: number;
    Longitude: number;
    RadiusofEffectiveRange: number;
  }[];
};

type UserResponse = {
  Data: {
    isVerify: boolean;
    userModule: string[];
    userName: string;
    userRole: any[];
    IsSupervisor: boolean;
    IsSecretary: boolean;
    PersonalPicture: string;
    EmployeeNumber: string;
    GroupId: string;
    Gender: string;
    Language: string;
    CompanyCode: string;
    EmployeeId: string;
    CompanyId: string;
    IDType: number;
    IDTypeNameByUserLanguage: string;
    EmployeeName: string;
    CompanyName: string;
    NickName: string;
    EnglishName: string;
    CompanyTimeZone: string;
  };
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  userName: string;
  ".issued": string;
  ".expires": string;
  JobInfo: string;
  SelectCompanyRequired: boolean;
  UserStatus: number;
  code: string;
  refresh_expire: number;
};

type TokenResponse = {
  id_token: string;
  apphash: string;
};
