import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { setLanguage } from '@/reducers/app/action';
import VideoYoutube from '@/components/core/controls/VideoYoutube';

// style
import onlyMobileTabletSVG from '@/assets/images/ninja/ninja-header.svg';
import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';
import playVideoButton from '@/assets/images/ninja/play-video-button.svg';
import videoLeftCover from '@/assets/images/ninja/video-left-cover.jpg';
import videoRightCover from '@/assets/images/ninja/video-right-cover.jpg';
import phoneIcon from '@/assets/images/ninja/phone-icon.svg';
import './MobileOrTablet.scss';

const countryList = [
  {
    code: 'en',
    title: 'EN',
  },
  {
    code: 'zh',
    title: 'CN',
  },
  {
    code: 'fr',
    title: 'FR',
  },
  {
    code: 'de',
    title: 'DE',
  },
  {
    code: 'ja',
    title: 'JP',
  },
  {
    code: 'ko',
    title: 'KR',
  },
  {
    code: 'ru',
    title: 'RU',
  },
  {
    code: 'es',
    title: 'ES',
  },
];

const languagesWhitePaper = ['zh', 'fr', 'de', 'ru', 'ja', 'ko', 'es'];

class MobileOrTablet extends React.PureComponent {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.changeCountry = ::this.changeCountry;
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode);
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="container mobile-tablet">
        <div className="row firstSection">
          <div className="col-lg-5 d-flex">
            <img className="img-fluid imageHeader" src={onlyMobileTabletSVG} alt="ninja"/>
            <h1>{messages.MOT_TITLE}</h1>
          </div>
          <div className="col-lg-7 chooseLanguage">
            {
              countryList.map((item, index) => (
                <div
                  key={index}
                  className={`countryName ${locale === item.code ? 'countryActive' : ''}`}
                  onClick={() => this.changeCountry(item.code)}
                >
                  <span>{item.title}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="row secondSection animated2 fadeInUp">
          <div className="col-lg-6">
            <img src={phoneIcon} alt="phone icon" />
            <p>
              {messages.MOT_CONTENT_0}
              <br/>
              {messages.MOT_CONTENT_1} <a className="website" href="/">www.ninja.org</a> {messages.MOT_CONTENT_2}
              <br/>
              <span>{messages.MOT_CONTENT_3}</span>
            </p>
          </div>
          <div className="col-lg-6">
            <VideoYoutube
              playButtonIcon={playVideoButton}
              imageUrl={videoLeftCover}
              imageAlt="ninja place prediction"
              videoUrl="https://youtu.be/YYZJlLDzeEs"
              autoPlayVideo
            />
          </div>
        </div>

        <div className="row thirdSection animated3 fadeInUp">
          <div className="col-lg-7">
            <VideoYoutube
              playButtonIcon={playVideoButton}
              imageUrl={videoRightCover}
              imageAlt="prediction exchange walk thru"
              videoUrl="https://youtu.be/6bd6-XtO3Wk"
            />
          </div>
          <div className="col-lg-5">
            <ul>
              {
                locale === 'en' && (
                  <li>
                    Jump in for <a href="/shuriken" target="_blank" rel="noopener noreferrer">Airdrop</a>
                  </li>
                )
              }
              {
                messages.MOT_LIST_CONTENT.map((item, index) => {
                  let {link} = item;
                  if (index === 0 && locale !== 'en' && languagesWhitePaper.indexOf(locale) !== -1) {
                    link = '/whitepaper';
                  }
                  return (
                    <li key={index}>
                      {item.mainContent || ''} <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.placeHolderLink}
                      </a> {item.mainContent1 || ''}
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(MobileOrTablet));
