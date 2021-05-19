/* eslint-disable */

import './secure-otp.min';

export class BrowserChallenge {
  otpKey = '';
  s = [];
  tp = new jsOTP.totp();

  constructor() {
    this.s[0] = 'Ng';
    this.s[1] = 'VQ';
    this.s[2] = 'NQ';
    this.s[3] = 'Mw';
    this.s[4] = 'Qg';
    this.s[5] = 'SA';
    this.s[6] = 'Tg';
    this.s[7] = 'NQ';
    this.s[8] = 'WQ';
    this.s[9] = 'Sw';
    this.s[10] = 'NA';
    this.s[11] = 'QQ';
    this.s[12] = 'Vw';
    this.s[13] = 'Mw';
    this.s[14] = 'Mw';
    this.s[15] = 'Ng';

    this.otpKey = this.s.map(elem => atob(elem)).join('');
  }

  generate() {
    const totpToken = this.tp.getOtp(this.otpKey);
    const seq = () => this.substitutedChallengeSequence(totpToken).join('');
    return this.obfuscateChallenge(seq());
  }

  obfuscateChallenge(seq) {
    if(!seq) {
      return '';
    }

    return this.randomHex(2) + btoa(seq) + this.randomHex(29);
  }

  randomHex(length = 1, charset = '0123456789ASDFGHJKLZXCVBNMQWERTYUIOPzxcvbnmasdfghjklqwertyuiop') {
    let randomString = ''

    for (let i = 0; i < length; i++) {
      let randomPositionIndex = Math.floor(Math.random() * charset.length)
      randomString += charset.substring(randomPositionIndex, randomPositionIndex + 1)
    }

    return randomString
  }

  substitutedChallengeSequence(totpChallenge) {
    const storeSequence = this.generateRandomPositionSequence(totpChallenge.length);
    const challengeArray = totpChallenge.split('');
    let placed = [];

    for (let i = 0; i < storeSequence.length; i++) {
      const place = storeSequence[i];
      const challengeValue = challengeArray[place];
      placed.push(`${place}${challengeValue}`);
    }

    return placed;
  }

  generateRandomPositionSequence(length) {
    const placeholderArray = this.fillArray(length);
    return this.randomizeArrayItems(placeholderArray);
  }

  randomizeArrayItems(positionedNumberArray) {
    return positionedNumberArray.sort(() => Math.random() - 0.081);
  }

  fillArray(length) {
    let array = [];
    for (let i = 0; i < length; i++) {
      array.push(i);
    }
    return array;
  }
}
