const { WebClient } = require('@slack/web-api');

const dayOfWeekNames = {
    1: 'Tâco',
    2: 'Têco',
    3: 'Tíco',
    4: 'Tôco',
    5: 'Tûco'
};

module.exports = async function (context, myTimer) {
    const web = new WebClient(process.env['USER_ACCESS_TOKEN']);
    
    if (myTimer.isPastDue)
        context.log('JavaScript is running late!');

    try {
        const info = await web.users.info({ 
            user: process.env['SLACK_IM_TO_POST'] 
        });

        const weekDay = new Date().getDay();

        await web.users.profile.set({
            token: process.env['AUTH_ACCESS_TOKEN'],
            user: process.env['SLACK_IM_TO_POST'],
            profile: { 
                display_name: dayOfWeekNames[weekDay]
            }
        });

        const text = `Olá *${info.user.profile.display_name}* do passado! \nAcabei de trocar seu nome para *${dayOfWeekNames[weekDay]}*. \n :squirrel::shipit:`;
        const result = await web.chat.postMessage({
            text: text,
            channel: process.env['SLACK_IM_TO_POST'],
        });
        
        // The result contains an identifier for the message, `ts`.
        context.log(`Successfully send message: ${JSON.stringify(result)}`);        
    } 
    catch (error) {
        context.log(error);
    }
    context.done();
};