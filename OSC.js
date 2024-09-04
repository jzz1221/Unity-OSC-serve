import osc from "osc-js";
import WebSocket from "ws";

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });

// 创建OSC发送器
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,  // Unity的接收端口
    remoteAddress: "127.0.0.1",
    remotePort: 8000   // OSC消息发送的端口
});

udpPort.open();

// 当有客户端连接时
wss.on('connection', (ws) => {
    console.log('Client connected');

    // 接收到消息时
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // 处理加速度计数据
        if (data.type === 'accelerometer') {
            udpPort.send({
                address: "/accelerometer",
                args: [
                    { type: "f", value: data.data.x },
                    { type: "f", value: data.data.y },
                    { type: "f", value: data.data.z }
                ]
            });
        }

        // 处理陀螺仪数据
        if (data.type === 'gyroscope') {
            udpPort.send({
                address: "/gyroscope",
                args: [
                    { type: "f", value: data.data.alpha },
                    { type: "f", value: data.data.beta },
                    { type: "f", value: data.data.gamma }
                ]
            });
        }
    });

    // 当客户端断开连接时
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
