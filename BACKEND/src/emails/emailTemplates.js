export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to LINKVERSE</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
               background-color: #0d1117; 
               color: #e6edf3; 
               margin: 0; 
               padding: 0;">
    
    <div style="max-width: 600px; 
                margin: 30px auto; 
                background-color: #161b22; 
                border-radius: 16px; 
                overflow: hidden; 
                box-shadow: 0 0 30px rgba(56,139,253,0.2);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #238636, #0366d6); 
                  text-align: center; 
                  padding: 40px 30px;">
        <img src='https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="Messenger Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;'
             alt="Messenger Logo" 
             style="width: 80px; height: 80px; border-radius: 50%; background-color: white; padding: 8px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to LINKVERSE</h1>
        <p style="color: #c9d1d9; margin: 10px 0 0 0;">Your all-in-one messenger, reimagined.</p>
      </div>

      <!-- Body -->
      <div style="padding: 35px;">
        <p style="font-size: 18px; color: #58a6ff;">
          <strong>Hello ${name},</strong>
        </p>
        <p style="color: #c9d1d9;">We’re thrilled to welcome you to <strong>LINKVERSE</strong> — a space to connect, chat, and share moments with friends, family, and colleagues in real time.</p>

        <div style="background-color: #0d1117; 
                    border: 1px solid #30363d; 
                    border-left: 4px solid #58a6ff; 
                    border-radius: 10px; 
                    padding: 20px; 
                    margin: 25px 0;">
          <p style="margin: 0 0 12px 0; font-weight: 500; color: #79c0ff;">Get started in just a few steps:</p>
          <ul style="margin: 0; padding-left: 20px; color: #c9d1d9;">
            <li style="margin-bottom: 8px;">Set up your profile picture</li>
            <li style="margin-bottom: 8px;">Find and add your contacts</li>
            <li style="margin-bottom: 8px;">Start a conversation instantly</li>
            <li>Share photos, videos, and your favorite memories</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${clientURL}"
             style="background: linear-gradient(90deg, #0366d6, #58a6ff);
                    color: white;
                    text-decoration: none;
                    padding: 14px 40px;
                    border-radius: 50px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    box-shadow: 0 0 15px rgba(88,166,255,0.3);
                    transition: background 0.3s;">
            Open Messenger
          </a>
        </div>

        <p style="color: #8b949e;">Need help or have a question? Our support team is just a click away.</p>
        <p style="margin-top: 20px; color: #c9d1d9;">Happy chatting!</p>

        <p style="margin-top: 25px; color: #8b949e;">
          Best regards,<br />
          <strong style="color: #58a6ff;">The LINKVERSE Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #0d1117; 
                  text-align: center; 
                  padding: 20px; 
                  border-top: 1px solid #21262d;">
        <p style="font-size: 12px; color: #8b949e; margin: 0;">© 2025 LINKVERSE. All rights reserved.</p>
        <p style="margin-top: 10px;">
          <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
          <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 8px;">Terms of Service</a> |
          <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 8px;">Contact Us</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
}
