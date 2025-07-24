
interface Props{
  Name:string,
  Message:string,
  lang: string,
}
export const emailTemplete = (body:Props): string => {
  
  const data = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir=${body.lang === "en"? "ltr": "rtl"} xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap" rel="stylesheet">
    <!--<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail></w:DontUseAdvancedTypographyReadingMail>
    </w:WordDocument>
    </xml><![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
</head>

<body class="body">
    <div dir=${body.lang === "en"? "ltr": "rtl"} class="es-wrapper-color">
        <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f6f6f6" origin="0.5, 0" position="0.5, 0"></v:fill>
			</v:background>
		<![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table class="esd-header-popover es-header" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#00b4d8" align="center" style="background-color: #00b4d8;">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p25t es-p25b es-p40r es-p40l" align="left" dir="ltr" bgcolor="#4057a7" style="background-color: #4057a7;">
                                                        <!--[if mso]><table width="520" cellpadding="0"
                            cellspacing="0"><tr><td width="156" valign="top"><![endif]-->
                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame" width="156" valign="center" align="center">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://eervona.stripocdn.email/content/guids/CABINET_e4fa15c4b71ee4914154cc78bf743c75eff4daaf447e3d66e249e7f9f0f356df/images/logo_original_nolabel_invert.png" alt style="display: block; border-radius: 25px;" width="121"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td><td width="20"></td><td width="344" valign="top"><![endif]-->
                                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="344" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="right" class="esd-block-text" dir=${body.lang === "en"? "ltr": "rtl"}>
                                                                                        <p style="color: #ffffff;"><br></p>
                                                                                        <p style="color: #ffffff;">Mirza Taza Gul Khan Cultural Foundation</p>
                                                                                        <h1 style="font-size: 16px; color: #ffffff;">نهاد فرهنگی میرزا تازه گل خان</h1>
                                                                                        <h1 style="font-size: 16px; color: #ffffff;">د میرزا تازه گل خان فرهنگي ټولنه<br type="_moz"></h1>
                                                                                        <h1 style="font-size: 16px; color: #ffffff;">میرزا تازه گل خان به چاک پاک مېله ام</h1>
                                                                                        <p style="color: #ffffff;"><br></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p40r es-p40l esdev-adapt-off" align="left" dir="ltr">
                                                        <table cellspacing="0" cellpadding="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r esd-container-frame" width="520" valign="top" align="center">
                                                                        <table width="100%" cellspacing="20px" cellpadding="20px">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-p25" style="font-size: 0px;"><a target="_blank" href="https://viewstripo.email"><img class="adapt-img" src="https://eervona.stripocdn.email/content/guids/CABINET_e4fa15c4b71ee4914154cc78bf743c75eff4daaf447e3d66e249e7f9f0f356df/images/logo_original.png" alt="Cancer Survivors Day" style="display: block;" width="200" title="Cancer Survivors Day"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p30b es-p40r es-p40l" align="left" dir="ltr">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="520" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-m-txt-c">
                                                                                        <h1 dir=${body.lang === "en"? "ltr": "rtl"} style="line-height: 120%;">${body.Name}</h1>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align=${body.lang === "en"? "left": "right"} class="esd-block-text es-p20t es-p20b es-p15r es-m-p0r" dir=${body.lang === "en"? "ltr": "rtl"}>
                                                                                        <p>${body.Message}</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-footer esd-footer-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p40" align="left" dir="ltr" bgcolor="#4057a7" style="background-color: #4057a7;">
                                                        <table cellspacing="0" cellpadding="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="520" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social es-m-txt-c es-p20" style="font-size:0"><a class="esd-anchor" name="email"></a>
                                                                                        <table cellpadding="20px" cellspacing="20px" class="es-table-not-adapt es-social" dir="ltr">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" class="es-p20r" esd-tmp-icon-type="facebook"><a target="_blank" href><img src="https://eervona.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" title="Facebook" width="24" height="24" style="font-size: 12px;"></a></td>
                                                                                                    <td align="center" valign="top" esd-tmp-icon-type="instagram"><a target="_blank" href><img src="https://eervona.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Ig" title="Instagram" width="24" height="24" style="font-size: 12px;"></a></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
  `;
  return data;
};
