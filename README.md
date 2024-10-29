# Bug with MSW and axios + tough-cookie 

COnfirmed on Node 20.17.0 on macOS 14 and 15

1. Download 
2. `yarn && yarn start`
3. See how it fails only after turning on `msw` with bypassing unhandled requests
4. Either change msw version to `2.4.3` in `package.json` or comment out turning on msw
5. See no errors anymore

