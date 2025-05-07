import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyAdminDrive',
  access:(allow) => ({
    '*':[
        allow.guest.to(['read', 'write', 'delete'])
    ]
  })
});