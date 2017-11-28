# -*- coding: utf-8 -*-

import smtplib
from email.mime.text import MIMEText
from email.header import Header
from email.message import EmailMessage

def send_email(user, pwd, recipient,send_cc, subject, body): 

    gmail_user = user
    gmail_pwd = pwd
    FROM = user
    TO = recipient if type(recipient) is list else [recipient]
    CC = send_cc if type(send_cc) is list else [send_cc]
    SUBJECT = subject#.encode('ascii', 'replace')
    TEXT = body#.encode('ascii', 'replace')

    msg = EmailMessage()
    msg.set_content(TEXT)
    msg['Subject'] = SUBJECT
    msg['From'] = FROM
    msg['To'] = TO





    # Prepare actual message
    #message = """From: %s\nTo: %s\nCc: %s\nSubject: %s\n\n%s
    #""" % (FROM, ", ".join(TO),", ".join(CC), SUBJECT, TEXT)
    #print(message)
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_pwd)
        #server.sendmail(FROM, TO, message)
        #server.close()
        server.send_message(msg)
        server.quit()
        print ('successfully sent the mail')
    except Exception as inst:
        print (type(inst))     # the exception instanc
        print (inst.args)  
        print ("failed to send mail")
