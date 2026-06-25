const qiniu = require('qiniu');

const accessKey = 'zfc9y0LL6rUe5b6dz0c43yOx7cKOxtHn4bON76rz';
const secretKey = 'yoJYJH0AnqKFFcSVJUONwA-OSxwP4jzFvAlefJwL';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// Get buckets
bucketManager.listBucket(function(err, respBody, respInfo) {
  if (err) {
    console.error(err);
    return;
  }
  if (respInfo.statusCode == 200) {
    console.log('Buckets:', respBody);
    if (respBody.length > 0) {
      const bucketName = respBody[0];
      console.log('Using bucket:', bucketName);
      // Get domain
      bucketManager.listBucketDomains(bucketName, function(err, respBody, respInfo) {
        if (err) {
          console.error(err);
        } else {
          console.log('Domains:', respBody);
        }
      });
    }
  } else {
    console.log(respInfo.statusCode, respBody);
  }
});
