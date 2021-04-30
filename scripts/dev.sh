 #!/bin/sh

npm run start -- service-user &
npm run start -- service-account &
npm run start -- gateway
