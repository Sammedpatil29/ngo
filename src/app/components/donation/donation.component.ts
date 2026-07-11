import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";
import { timer, switchMap, tap, takeWhile, finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';

declare var Razorpay: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule, LoaderComponent, ClipboardModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent implements OnInit {

  bankDetails = {
    bankName: 'UNION BANK',
    accountName: 'May I Help You Foundation',
    accountNumber: '043711100002944',
    ifscCode: 'UBIN0804371',
    branch: 'Proddatur Main Branch',
    upiId: '62918801@ubin'
  };

  selectedLanguage: any = 'english';  

  changedText: any;

  isLoading: boolean = false

  languages:any = {
      kannada: {
        header: 'ಈಗಲೇ ದಾನ ಮಾಡಿ',
        name: 'ದಾನಿಯ ಹೆಸರು',
        email: 'ಇಮೇಲ್ ವಿಳಾಸ',
        phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
        city: 'ಊರು/ನಗರ',
        amount: 'ದಾನದ ಮೊತ್ತ',
        message: 'ಸಂದೇಶ',
        submit: 'ಪೇಮೆಂಟ್ ಮಾಡಿ',
        submitauto: 'ಆಟೋ ಪೇಮೆಂಟ್',
        bankDetails: 'ಬ್ಯಾಂಕ್ ಖಾತೆಯ ವಿವರಗಳು',
        bankName: 'ಬ್ಯಾಂಕ್ ಹೆಸರು',
        accountName: 'ಖಾತೆ ಹೆಸರು',
        accountNumber: 'ಖಾತೆ ಸಂಖ್ಯೆ',
        branch: 'ಶಾಖೆಯ ಹೆಸರು',
        ifscCode: 'IFSC ಕೋಡ್',
        donorConfirmationMessage: 'ರಕ್ತದಾನಿಯಾಗಲು ಬಯಸುತ್ತಿರಾ?',
        yes : 'ಹೌದು',
        no: 'ಇಲ್ಲ',
        bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
        scantopay: 'ಸ್ಕ್ಯಾನ್ ಟು ಪೇ',
        acceptMessage: 'UPI ಪೇಮೆಂಟ್ ಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೇವೆ.',
        placeholder: {
          phone: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
          name: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
          email: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
          city: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಊರು/ನಗರವನ್ನು ನಮೂದಿಸಿ',
          amount: 'ದಯವಿಟ್ಟು ದಾನದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
          message: 'ದಯವಿಟ್ಟು ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ...'
        },
        quotes: [
          'ಪ್ರತಿಯೊಬ್ಬರೂ ದೊಡ್ಡ ದೊಡ್ಡ ಸೇವೆಗಳನ್ನು ಮಾಡಲಾಗಬಹುದು, ಆದರೆ ಮಾಡಿದ ಸಣ್ಣ ಸಹಾಯ ದೊಡ್ಡದಾಗಬಹುದು.',
          'ಅವಶ್ಯಕತೆ ಇರುವ ಬಡ ಜನರಿಗೆ ನಿಮ್ಮ ಸಹಾಯ ಮುಖ್ಯವಾಗಿದೆ.',
          'ಸದಾ ನಿಮ್ಮ ಸೇವೆಯಲ್ಲಿ!',
          'ಅನಾಥ ಶವಗಳಿಗೆ ಅಂತ್ಯಕ್ರಿಯೆ ◇ ರಕ್ತ ದಾನ ◇ ಮೆಡಿಕಲ್ ಕ್ಯಾಂಪ್ ◇ ಫ್ರೀ ಕೂಲಿಂಗ್ ಬಾಕ್ಸ್ ◇ ವೃದ್ಧಾಶ್ರಮ ◇ ಕಣ್ಣು ದಾನ ◇ ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ ◇ ಉಚಿತ ವೈಕುಂಠ ವಾಹನ ◇ ಫ್ರೀ ದಿನಸಿ ◇ ಪರಿಸರ ಸಂರಕ್ಷಣಾ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಇತರ ಸೇವೆಗಳು.',
          'ಪೇಮೆಂಟ್ ಅಪ್ಡೇಟ್ ಗಳನ್ನು ಕಳೆದುಕೊಳ್ಳದೆ ಇರಲು, ಇಮೇಲ್ ಅನ್ನು ದಯವಿಟ್ಟು ಒಮ್ಮೆ ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
          'ನೀವು ರಕ್ತದಾನಿಯಾದರೆ, ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ ಎಮರ್ಜೆನ್ಸೀ ಇದ್ದಾಗ ನಾವು ಕರೆಮಾಡುತ್ತೇವೆ.'
      ],
      paymentSuccessTitle: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',
      paymentFailedTitle: 'ಪಾವತಿ ವಿಫಲವಾಗಿದೆ',
      paymentFailedMessage: 'ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
paymentSuccessMessage: 'ಪ್ರಿಯ ${donorName},\nನಿಮ್ಮ ಉದಾರ ದೇಣಿಗೆಗೆ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಬೆಂಬಲಕ್ಕೆ ನಾವು ಕೃತಜ್ಞರಾಗಿದ್ದೇವೆ.',
paymentVerificationFailedTitle: 'ಪಾವತಿ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ',
paymentVerificationFailedMessage: 'ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
paymentVerificationTimedOutTitle: 'ಪಾವತಿ ಪರಿಶೀಲನೆಯ ಸಮಯ ಮೀರಿದೆ',
paymentVerificationTimedOutMessage: 'ನಿಮ್ಮ ಪಾವತಿಯ ಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕರಿಸಲು ನಮಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.'
      },
      telugu: {
        header: 'ఇప్పుడే విరాళం ఇవ్వండి',
        name: 'విరాళ దాత పేరు',
        email: 'ఈమెయిల్ వివరాలు',
        phone: 'దూరవాణి సంఖ్య',
        city: 'నగరం/పట్టణం',
        amount: 'దాన మొత్తం',
        message: 'సందేశం',
        submit: 'పేమెంట్ చేయండి',
        submitauto: 'Monthly ఆటో పేమెంట్',
        bankDetails: 'బ్యాంక్ ఖాతె వివరాలు',
        bankName: 'బ్యాంక్ పేరు',
        accountName: 'అకౌంటు పేరు',
        accountNumber: 'అకౌంటు సంఖ్య',
        branch: 'బ్రాంచ్ పేరు',
        ifscCode: 'IFSC కోడ్',
        donorConfirmationMessage: 'రక్తదానం చేయాలనుకుంటున్నారా?',
        yes : 'అవును',
        no: 'లేదు',
        bloodGroup: 'బ్లడ్ గ్రూప్',
        scantopay: 'స్కాన్ టు పే',
        acceptMessage: 'UPI పేమెంట్లను స్వీకరిస్తాము.',
        placeholder: {
          phone: 'దయచేసి మీ ఫోన్ నంబర్ ను నమోదు చేయండి',
          name: 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి',
          email: 'దయచేసి మీ ఈమెయిల్ చిరునామాను నమోదు చేయండి',
          city: 'దయచేసి మీ నగరం/పట్టణం నమోదు చేయండి',
          amount: 'దయచేసి దాన మొత్తాన్ని నమోదు చేయండి',
          message: 'దయచేసి సందేశాన్ని వ్రాయండి...'
        },
        quotes: [
          'ప్రతి వాళ్ళు గొప్ప సేవలు చెయ్యలేకపోవచ్చు, కానీ చేసిన చిన్న సేవ గొప్పగా ఉండాలి.',
          'అవసరమైన పేద ప్రజలకు మీ సహయం ముఖ్యం.',
          'సదా మీ సేవలో...',
          'ఆనాథ శవానికి అంత్యక్రియలు ◇ రక్తదానం ◇ మెడికల్ క్యాంప్ ◇ ఫ్రీ కూలింగ్ బాక్స్ ◇ ఓల్డ్ ఎజ్ హోమ్ ◇ కంటి దానం ◇ ఉచిత అంబులెన్స్ ◇ ఉచిత వైకుంఠ రథం ◇ ఫ్రీ స్టేషనరీ ◇ పర్యావరణంపై అవగాహన సదస్సు.     ◇  ఆనాథ శవానికి అంత్యక్రియలు ◇ రక్తదానం ◇ మెడికల్ క్యాంప్ ◇ ఫ్రీ కూలింగ్ బాక్స్ ◇ ఓల్డ్ ఎజ్ హోమ్ ◇ కంటి దానం ◇ ఉచిత అంబులెన్స్ ◇ ఉచిత వైకుంఠ రథం ◇ ఫ్రీ స్టేషనరీ ◇ పర్యావరణంపై అవగాహన సదస్సు.',
          'దయచేసి చెల్లింపు నవీకరణలను మిస్ కాకుండా ఉండటానికి, ఇమెయిల్‌ను ఒకసారి తనిఖీ చేయండి.',
          'మీరు రక్తదాత అయితే, మీ సమీపంలో అత్యవసర పరిస్థితి ఉన్నప్పుడు మేము మీకు కాల్ చేస్తాము.'
        ],
        paymentSuccessTitle: 'మీ విరాళం విజయవంతంగా అందింది!',
        paymentFailedTitle: 'మీ విరాళం విఫలమైంది',
        paymentFailedMessage: 'మీ చెల్లింపు ప్రక్రియను ప్రాసెస్ చేయలేకపోయింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా సహాయ (Support) కేంద్రాన్ని సంప్రదించండి.',
paymentSuccessMessage: 'ప్రియమైన ${donorName},\nమీరు అందించిన ఉదారమైన విరాళానికి ధన్యవాదాలు! మీ మద్దతుకు మేము ఎంతగానో కృతజ్ఞులం.',
paymentVerificationFailedTitle: 'చెల్లింపు ధృవీకరణ విఫలమైంది',
paymentVerificationFailedMessage: 'మీ చెల్లింపును ధృవీకరించడం సాధ్యం కాలేదు. దయచేసి సహాయక బృందాన్ని (Support) సంప్రదించండి.',
paymentVerificationTimedOutTitle: 'చెల్లింపు ధృవీకరణ సమయం ముగిసింది',
paymentVerificationTimedOutMessage: 'మేము మీ చెల్లింపు స్థితిని నిర్ధారించలేకపోయాము. దయచేసి సహాయక బృందాన్ని (Support) సంప్రదించండి.'
  
      },
      tamil: {
         header: 'இப்போதுதான் தானம் செய்யவும்',
        name: 'தானியாளர் பெயர்',
        email: 'மின்னஞ்சல் முகவரி',
        phone: 'தொலைபேசி எண்',
        city: 'நகரம்/ஊர்',
        amount: 'தானம் தொகை',
        message: 'செய்தி',
        submit: 'பணம் செலுத்த தொடரவும்',
        submitauto: 'மாதாந்திர தானியங்கு பணம் செலுத்த',
        bankDetails: 'வங்கி கணக்கு விவரங்கள்',
        bankName: 'வங்கி பெயர்',
        accountName: 'கணக்கு பெயர்',
        accountNumber: 'கணக்கு எண்',
        branch: 'கிளை பெயர்',
        ifscCode: 'IFSC குறியீடு',
        donorConfirmationMessage: 'தானியாளர் ஆக விரும்புகிறீர்களா?',
        yes : 'ஆம்',
        no: 'இல்லை',
        bloodGroup: 'இரத்த குழு',
        scantopay: 'பணம் செலுத்த ஸ்கேன் செய்யவும்',
        acceptMessage: 'UPI பணப்பரிவர்த்தனைகளை ஏற்றுக்கொள்கிறோம்.',
        placeholder: {
          phone: 'தயவுசெய்து உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
          name: 'தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும்',
          email: 'தயவுசெய்து உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்',
          city: 'தயவுசெய்து உங்கள் நகரம்/ஊரை உள்ளிடவும்',
          amount: 'தயவுசெய்து தானம் தொகையை உள்ளிடவும்',
          message: 'தயவுசெய்து செய்தியை உள்ளிடவும்...'
        },
        quotes: [
          'ஒவ்வொருவரும் பெரிய சேவைகளை செய்ய முடியாது, ஆனால் செய்த சிறிய உதவி பெரியதாக இருக்கலாம்.',
          'அவச்சியமான கூட்டமைப்புகளுக்கு உங்கள் உதவி முக்கியமானது.',
          'எப்போதும் உங்கள் சேவையில்...',
          'அனாத தொடர்புகளுக்கான இறக்கும் செயல் ◇ ரத்ததானம் ◇ மெடிகல் கேம்ப் ◇ இலவச கூலிங் பேக் ◇ பழைய வயதினர் வீடு ◇ கண்ணுக்கான தானம் ◇ இலவச அம்புலன்ஸ் ◇ இலவச வைகுண்டி ரத்தம் ◇ இலவச நிலையம் ◇சரஸ்வதி.',
          'பணம் அப்டெட்ஸை இழப்பதிலிருந்து சிறப்பாக, emailஐ  once check.',
          'நீங்கள் ரத்ததானராயினால், அருகில் ஆபத்து இருபடி, எனவே எழுதி அழைப்படுவதற்காக.'
        ],
paymentSuccessTitle: 'பணம் செலுத்துதல் வெற்றிகரமாக முடிந்தது!',
paymentFailedTitle: 'பணம் செலுத்துதல் தோல்வியுற்றது',
paymentFailedMessage: 'உங்கள் பணம் செலுத்தும் செயல்முறை முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவு குழுவை தொடர்பு கொள்ளவும்.',
paymentSuccessMessage: 'அன்பிற்குரிய ${donorName},\nஉங்களின் தாராளமான நன்கொடைக்கு நன்றி! உங்கள் ஆதரவிற்கு நாங்கள் மிகவும் கடமைப்பட்டிருக்கிறோம்.',
paymentVerificationFailedTitle: 'பணம் செலுத்தல் சரிபார்ப்பு தோல்வியுற்றது',
paymentVerificationFailedMessage: 'உங்கள் பணம் செலுத்துதலை சரிபார்க்க முடியவில்லை. தயவுசெய்து ஆதரவு குழுவை (Support) தொடர்பு கொள்ளவும்.',
paymentVerificationTimedOutTitle: 'பணம் செலுத்தல் சரிபார்ப்பு நேரம் முடிந்தது',
paymentVerificationTimedOutMessage: 'உங்கள் பணம் செலுத்திய நிலையை எங்களால் உறுதிப்படுத்த முடியவில்லை. தயவுசெய்து ஆதரவு குழுவை (Support) தொடர்பு கொள்ளவும்.'  
      },
      hindi: {
        header: 'अभिनन्दन करें',
        name: 'दाता का नाम',
        email: 'ईमेल पता',
        phone: 'फ़ोन नंबर',
        city: 'शहर',
        amount: 'दान राशि',
        message: 'संदेश',
        submit: 'भुगतान के लिए आगे बढ़ें',
        submitauto: 'मासिक ऑटो भुगतान',
        bankDetails: 'बैंक खाता विवरण',
        bankName: 'बैंक का नाम',
        accountName: 'खाता नाम',
        accountNumber: 'खाता संख्या',
        branch: 'शाखा का नाम',
        ifscCode: 'IFSC कोड',
        donorConfirmationMessage: 'क्या आप दाता बनना चाहते हैं?',
        yes : 'हां',
        no: 'नहीं',
        bloodGroup: 'रक्त समूह',
        scantopay: 'भुगतान के लिए स्कैन करें',
        acceptMessage: 'UPI भुगतान स्वीकार किए जा रहे हैं।',
        placeholder: {
          phone: 'कृपया अपना फ़ोन नंबर दर्ज करें',
          name: 'कृपया अपना पूरा नाम दर्ज करें',
          email: 'कृपया अपना ईमेल पता दर्ज करें',
          city: 'कृपया अपना शहर दर्ज करें',
          amount: 'कृपया दान राशि दर्ज करें',
          message: 'कृपया एक संदेश दर्ज करें...'
        },
        quotes: [
          'हर कोई बड़ी सेवा नहीं कर सकता, लेकिन की गई छोटी मदद बड़ी हो सकती है।',
          'जरूरतमंद गरीब लोगों के लिए आपकी मदद महत्वपूर्ण है।',
          'हमेशा आपकी सेवा में...',
          'अनाथ शवों के अंतिम संस्कार ◇ रक्तदान ◇ मेडिकल कैंप ◇ फ्री कूलिंग बॉक्स ◇ ओल्ड एज होम ◇ आंखों का दान ◇ मुफ्त एम्बुलेंस ◇ मुफ्त वैकुंठ रथ ◇ फ्री स्टेशनरी ◇ पर्यावरण पर जागरूकता सम्मेलन।',
          'कृपया भुगतान अपडेट्स को मिस न करने के लिए, कृपया ईमेल की एक बार जांच करें।',
          'यदि आप रक्तदाता हैं, तो जब आपके पास नजदीकी आपातकालीन स्थिति होगी, तो हम आपको कॉल करेंगे।'
        ],
        paymentSuccessTitle: 'भुगतान सफल!',
        paymentFailedTitle: 'भुगतान विफल',
        paymentFailedMessage: 'आपका भुगतान प्रक्रिया में नहीं हो सका। कृपया फिर से प्रयास करें या समर्थन के लिए संपर्क करें。',
      paymentSuccessMessage: 'प्रिय ${donorName},\nआपके उदार दान के लिए धन्यवाद! हम आपके समर्थन के लिए आभारी हैं।',
      paymentVerificationFailedTitle: 'भुगतान सत्यापन विफल',
      paymentVerificationFailedMessage: 'आपका भुगतान सत्यापित नहीं किया जा सका। कृपया समर्थन के लिए संपर्क करें。',
      paymentVerificationTimedOutTitle: 'भुगतान सत्यापन समय समाप्त',
      paymentVerificationTimedOutMessage: 'हम आपके भुगतान की स्थिति की पुष्टि नहीं कर सके। कृपया समर्थन के लिए संपर्क करें。'

      },
      english:{
        header: 'Donate Now',
        name: 'Donor Name',
        email: 'Email Address',
        phone: 'Phone Number',
        city: 'City',
        amount: 'Donation Amount',
        message: 'Message',
        submit: 'Proceed to payment',
        submitauto: 'Monthly Auto Payment',
        bankDetails: 'Bank Account Details',
        bankName: 'Bank Name',
        accountName: 'Account Name',
        accountNumber: 'Account Number',
        branch: 'Branch Name',
        ifscCode: 'IFSC Code',
        donorConfirmationMessage: 'Want to be a donor?',
        yes : 'Yes',
        no: 'No',
        bloodGroup: 'Blood Group',
        scantopay: 'Scan to Pay',
        acceptMessage: 'Accepting UPI payments.',
        placeholder: {
          phone: 'Please enter your phone number',
          name: 'Please enter your full name',
          email: 'Please enter your email address',
          city: 'Please enter your city',
          amount: 'Please enter the donation amount',
          message: 'Please enter a message...'
        },
        quotes: [
          'Not everyone can do great things, but small help can be great.',
          'Your help is important for the needy poor.',
          'Always at your service...',
          'Funeral services for orphaned corpses ◇ Blood donation ◇ Medical camp ◇ Free cooling box ◇ Old age home ◇ Eye donation ◇ Free ambulance ◇ Free Vaikuntha Ratham ◇ Free stationery ◇ Awareness conference on the environment.',
          'Please check the email once to ensure that payment updates are not missed.',
          'If you are a blood donor, we will call you when there is an emergency near you.'
      ],
      paymentSuccessTitle: 'Payment Successful!',
      paymentFailedTitle: 'Payment Failed!',
      paymentFailedMessage: 'Your payment could not be processed. Please try again or contact support.',
      paymentSuccessMessage: 'Dear ${donorName},\nThank you for your generous donation! We are grateful for your support.',
      paymentVerificationFailedTitle: 'Payment Verification Failed',
      paymentVerificationFailedMessage: 'Your payment could not be verified. Please contact support.',
      paymentVerificationTimedOutTitle: 'Payment Verification Timed Out',
      paymentVerificationTimedOutMessage: 'We could not confirm your payment status. Please contact support.'
        
      }
    }

  donation = {
    donorName: "",
    email: "",
    phone: "",
    city: "",
    amount: '',
    currency: "INR",
    message: "",
    transactionId: "",
    paymentStatus: "pending",
    isBloodDonor: false,
    bloodGroup: ""
  };

  showPaymentModal = false;
  paymentStatus: 'success' | 'failure' = 'success';
  paymentTitle = '';
  paymentMessage = '';

  constructor(private commonService: CommonServiceService, private zone: NgZone, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.changedText = this.languages[this.selectedLanguage]; // Initialize with default language
    this.loadRazorpayScript();
    this.route.queryParams.subscribe(params => {
      const lang = params['lang'];
      if (lang && this.languages[lang]) {
        this.selectedLanguage = lang;
        this.changedText = this.languages[this.selectedLanguage];
      } else {
        this.selectedLanguage = 'english'; // Default to English if no valid lang param
      }
    });
  }

  loadRazorpayScript() {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }

  changeLanguage(){
    this.changedText = this.languages[this.selectedLanguage]
    this.router.navigate([], {
      queryParams: {
        lang: this.selectedLanguage
      },
      queryParamsHandling: 'merge' // 'merge' keeps existing query params, 'preserve' keeps old ones completely, default replaces them
    });
  }

  submitDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount) {
      this.showModal('failure', 'Missing Information', 'Please enter a donation amount.');
      return;
    }
    this.isLoading = true
    this.commonService.createDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpay(response);
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error initiating donation:', error);
        this.showModal('failure', 'Error', 'Something went wrong. Please try again later.');
      }
    });
  }

  submitAutoDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount) {
      this.showModal('failure', 'Missing Information', 'Please enter a donation amount.');
      return;
    }
    this.isLoading = true
    this.commonService.createAutoDonation(this.donation).subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.openRazorpayForSubscription(response.subscription_id);
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error initiating autopay donation:', error);
        this.showModal('failure', 'Error', 'Something went wrong. Please try again later.');
      }
    });
  }

  openRazorpay(orderData: any) {
    const options = {
      key: environment.razorpay_id, // Public Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'May I Help You Foundation',
      description: 'Donation',
      image: '/assets/logo.png',
      order_id: orderData.orderId,
      handler: (response: any) => {
        this.zone.run(() => {
          this.verifyPayment(response);
        });
      },
      prefill: {
        name: this.donation.donorName,
        email: this.donation.email,
        contact: this.donation.phone
      },
      notes: {
        address: this.donation.city
      },
      theme: {
        color: '#d31a70'
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.isLoading = false;
            console.log('User closed the Razorpay modal');
          });
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      this.zone.run(() => {
        console.error('Payment failed:', response.error);
        this.showModal('failure', this.changedText.paymentFailedTitle, this.changedText.paymentFailedMessage);
        this.isLoading = false;
      });
    });
    rzp.open();
  }

  openRazorpayForSubscription(subscriptionId: string) {
  const options = {
    key: environment.razorpay_id, // Public Key ID
    subscription_id: subscriptionId, // Mandate session identifier
    name: 'May I Help You Foundation',
    description: 'Monthly Automated Contribution',
    image: '/assets/logo.png',
    handler: (response: any) => {
      this.zone.run(() => {
        // Triggered automatically if authorization passes
        this.verifySignatureOnBackend(response);
      });
    },
    prefill: {
        name: this.donation.donorName,
        email: this.donation.email,
        contact: this.donation.phone
      },
      notes: {
        address: this.donation.city
      },
      theme: {
        color: '#d31a70'
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.isLoading = false;
            console.log('User closed the Razorpay modal');
          });
        }
      }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

verifySignatureOnBackend(response:any){
  this.isLoading = true;
 this.commonService.verifyCustomSub(response).subscribe((res:any )=> {
    if(res.status === 'completed'){
      this.isLoading = false;
      const donorName = this.donation.donorName; // Store donor name before clearing
      this.showModal('success', this.changedText.paymentSuccessTitle, this.changedText.paymentSuccessMessage.replace('${donorName}', donorName));
      this.donation = {
        donorName: "",
        email: "",
        phone: '',
        city: '',
        amount: '',
        currency: "INR",
        message: "",
        transactionId: "",
        paymentStatus: "pending",
        isBloodDonor: false,
        bloodGroup: ""
      };
    } else {
      this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
    }
  },
  err => {
    this.isLoading = false;
    console.error('Error occurred while verifying custom subscription:', err);
    this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
  });
}

  showModal(status: 'success' | 'failure', title: string, message: string) {
    this.paymentStatus = status;
    this.paymentTitle = title;
    this.paymentMessage = message;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  verifyPayment(paymentResponse: any) {
     this.isLoading = true;

    const MAX_RETRIES = 5;
    const RETRY_INTERVAL_MS = 3000; // 3 seconds

    let attempt = 0;

    timer(0, RETRY_INTERVAL_MS).pipe(
      tap(() => attempt++),
      switchMap(() => this.commonService.verifyPayment(paymentResponse)),
      tap((response: any) => {
        // Assuming the response has a 'status' field, e.g., { status: 'success' | 'failure' | 'pending' }
        if (response.status === 'success') {
          this.isLoading = false;
          this.showModal('success', this.changedText.paymentSuccessTitle, this.changedText.paymentSuccessMessage.replace('${donorName}', this.donation.donorName));
          this.donation = {
            donorName: "",
            email: "",
            phone: '',
            city: '',
            amount: '',
            currency: "INR",
            message: "",
            transactionId: "",
            paymentStatus: "pending",
            isBloodDonor: false,
            bloodGroup: ""
          };
        } else if (response.status === 'failure') {
          this.isLoading = false;
          console.error('Payment verification failed with status: failure', response);
          this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
        }
      }),
      takeWhile((response: any) => response.status === 'pending' && attempt < MAX_RETRIES, true),
      finalize(() => {
        if (this.isLoading) { // If still loading, it means polling timed out
          this.isLoading = false;
          this.showModal('failure', this.changedText.paymentVerificationTimedOutTitle, this.changedText.paymentVerificationTimedOutMessage);
        }
      })
    ).subscribe();
  }

  checkPhone(phone: string) {
  if (phone.length === 10) {
    this.isLoading = true
    this.commonService.donorByPhone(phone).subscribe({
      next: (data: any) => {
        this.isLoading = false
        if (data) {
          this.donation.donorName = data.donorName || '';
          this.donation.email = data.email || '';
          this.donation.city = data.city || '';
          this.donation.isBloodDonor = data.isBloodDonor || false;
          this.donation.bloodGroup = data.bloodGroup || '';
          this.donation.amount = data.amount || '';
        }
      },
      error: (err) => {
        this.isLoading = false
        console.log('Donor not found or error:', err);
        this.donation.donorName =  '';
          this.donation.email = '';
          this.donation.city = '';
          this.donation.isBloodDonor = false;
          this.donation.bloodGroup = '';
          this.donation.amount = '';
      }
    });
  }
}

gotoHome(){
  this.router.navigate(['/home'])
}

}