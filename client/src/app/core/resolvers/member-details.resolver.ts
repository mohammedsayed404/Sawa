import { ResolveFn } from '@angular/router';
import { MembersService } from '../services/members.service';
import { inject } from '@angular/core';
import { IMember } from '../Models/IMember';

export const memberDetailsResolver: ResolveFn<IMember> = (route, state) => {

  const _membersService = inject(MembersService);

  return _membersService.GetMemberByUsername(route.paramMap.get('username')!);
};
