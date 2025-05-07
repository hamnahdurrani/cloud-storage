import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyAdminDrive',
  access:(allow) => ({
    'uploads/*':[
        allow.guest.to(['read', 'write', 'delete'])
    ]
  })
});