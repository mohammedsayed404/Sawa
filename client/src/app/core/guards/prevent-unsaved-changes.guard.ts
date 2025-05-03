import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from 'src/app/views/members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent>
= (component, currentRoute, currentState, nextState) => {
  if(component.editForm?.dirty) {
    const confirm = window.confirm('You have unsaved changes. Do you really want to leave?');
    return confirm;
  }

  return true;
};
