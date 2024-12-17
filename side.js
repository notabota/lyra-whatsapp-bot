const qrcode = require('qrcode-terminal');

const data = {
    "severity": "info",
    "timestamp": "2024-12-16T09:36:37.754366141Z",
    "message": "2@KOn1J+HdffM9Cw11SiDEmqDlsb/lyYjs6hCKVJlyuEmFW23ww7SNvz36Da5SPzWUI4sP0bxytWH0aUxk3nlDDEB5U5pyd4d0sJQ=,nb3bBcBnPnG9oQvZimz5OG/LZ0Y283xbiqdTnD2qkVQ=,kXHKyN/f+sf+4Eyx8KHiRqJf8cgQ/4qw+dqyWaOAxHc=,gRLNUBqN3FF/Brr7IDDknGb3dS1dHas2CcGJn0kJM40=,1",
    "tags": {
        "deploymentId": "2b1b1b6a-2393-4ada-b43f-d8aeb4d6f88b",
        "deploymentInstanceId": "d37f1b4e-fa5e-4de5-89c6-153f26274102",
        "environmentId": "e6d76766-7d17-487d-bcc5-a5e6cbf554d5",
        "pluginId": null,
        "projectId": "07096353-0cdf-443b-9345-8937b41935eb",
        "serviceId": "79692101-7467-4535-9a86-6042b994b48e",
        "snapshotId": null
    },
    "attributes": {
        "level": "info"
    }
}

const qr = data["message"];

qrcode.generate(qr, {small: true});
