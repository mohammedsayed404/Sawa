import { IUser } from "./IUser";

export class UserParams{

  gender:string;
  minAge=18 ;
  maxAge=90;
  pageNumber=1;
  pageSize=5;
  orderBy = 'lastActive'
  constructor(user:IUser){
    this.gender = user.gender === 'male' ? 'female' : 'male';

  }

}
