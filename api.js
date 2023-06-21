const handleRequest = async (request, response) => {

    const { url, method, headers } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;
  
    if ((filePath === "/inverter") && (method.toUpperCase() === "GET")) {
        console.log('Adding consumptiondata from file')
        response.statusCode = 200
        response.end()
    }

    if ((filePath === "/inverter") && (method.toUpperCase() === "POST")) {

        console.log('IN-VERTTER-I');
        console.log(request)
        response.statusCode = 200
        response.end()
    }
}
export default handleRequest