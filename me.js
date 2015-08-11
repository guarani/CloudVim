module.exports = function(ctx, cb) {
    var google = require('googleapis');
    var connect = require('connect');
    var exec = require('child_process').exec;
    var OAuth2 = google.auth.OAuth2;
    var plus = google.plus('v1');
    var drive = google.drive('v2');

    var oauth2Client = new OAuth2(
        '813929173832-ke9cgdqsnck5gk1m4n5ni3cbn55uadtr.apps.googleusercontent.com',
        'VlNK4sNr66r9IoBhfe8R5UOm',
        'http://localhost:8080');

    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
    ];

    var url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
      scope: scopes // If you only need one scope you can pass it as string
    });
    console.log(url);
    exec("open -a 'Google Chrome' '" + url + "'");

    var url = require('url');
    connect().use(function middleware1(req, res, next) {
        var url_parts = url.parse(req.url, true);
        console.log(url_parts.query);
        res.end('Thanks for registering with CloudVim');
        oauth2Client.getToken(url_parts.query.code, function(err, tokens) {
            if (!err) {
                oauth2Client.setCredentials(tokens);   

                plus.people.get({
                    userId: 'me',
                    auth: oauth2Client
                }, function(err, response) {
                    console.log("User's email: " + response.emails[0].value);
                });

                drive.files.list({
                    auth: oauth2Client,
                    maxResults: 100,
                }, function(err, response) {
                    if (err) {
                      console.log('The API returned an error: ' + err);
                      return;
                    }
                    var files = response.items;
                    if (files.length == 0) {
                      console.log('No files found.');
                    } else {
                      console.log('Files:');
                      for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        console.log('%s (%s)', file.title, file.id);
                      }
                    }
                });             
            }
        });
    }).listen(8080);
}
