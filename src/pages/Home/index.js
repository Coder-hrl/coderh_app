import {useState, useRef, Fragment} from 'react';
import {View, Flex} from '@ant-design/react-native';
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {ajax} from 'config';
import {Center, LayoutWrapper, EarlyWarningCard} from 'components';
import {navConfig, workConfig, iconObj} from './index.config';

import bgc from 'assets/images/Home/bgc.png';
import arrow from 'assets/images/Home/arrow.png';
import titleBgc from 'assets/images/Home/title_bgc.png';
import {useMount, useRequest} from 'ahooks';

function Home() {
  const navigation = useNavigation();
  const HomeScrollRef = useRef();

  const [navInfo, setNavInfo] = useState({});
  const [navList, setNavList] = useState(workConfig);
  const [gradientColor, setGradientColor] = useState([
    'rgba(218, 237, 254, 0)',
    'rgba(252, 255, 249, 0)',
  ]);
  const [titleShow, setTitleShow] = useState(false);

  const {run: getNavData} = useRequest(
    () =>
      ajax({
        url: '/app/get-nav-data',
        type: 'get',
        data: {},
      }),
    {
      manual: true,
      onSuccess: res => {
        setNavInfo(res.data);
      },
      onError: err => {
        console.log(err);
      },
    },
  );

  const {run: getNavigationData} = useRequest(
    () =>
      ajax({
        url: '/app/get-navigation-data',
        type: 'get',
        data: {},
      }),
    {
      manual: true,
      onSuccess: res => {
        console.log(res);
        setNavList(res.data);
      },
      onError: err => {
        console.log(err);
      },
    },
  );

  const fastJump = path => {
    navigation.push(path);
  };

  const onPgaeScroll = e => {
    let sy = e.nativeEvent.contentOffset.y;
    let dpheight = 50;
    let opacity = 0;
    if (sy <= dpheight) {
      opacity = sy / dpheight;
      setTitleShow(false);
    } else {
      opacity = 1;
      setTitleShow(true);
    }
    setGradientColor([
      `rgba(218, 237, 254, ${opacity})`,
      `rgba(252, 255, 249, ${opacity})`,
    ]);
  };

  useMount(() => {
    getNavData();
    getNavigationData();
  });

  const renderTitle = () => {
    return (
      <Fragment>
        <View style={styles.HomeTitle}>智慧海防安全</View>
        <ImageBackground
          source={titleBgc}
          style={styles.titleBgc}
          resizeMode="contain">
          <View style={{...styles.HomeTitle, color: '#273B5D'}}>管控平台</View>
        </ImageBackground>
      </Fragment>
    );
  };

  return (
    <ImageBackground style={styles.HomeBgc} resizeMode="cover" source={bgc}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={gradientColor}
        style={{...styles.homeFixBar}}>
        {titleShow ? (
          <Flex style={{paddingLeft: 20}}>{renderTitle()}</Flex>
        ) : null}
      </LinearGradient>
      <ScrollView
        style={styles.HomeScroll}
        ref={HomeScrollRef}
        onScroll={onPgaeScroll}
        showsVerticalScrollIndicator={false}>
        <LayoutWrapper translucent showBgc={false}>
          {/* 标题区域 */}
          <View style={styles.HomeTitleWrapper}>
            <Flex>{renderTitle()}</Flex>
          </View>
          {/* Nav栏 */}
          <Flex style={styles.HomeNavWrapper}>
            {navConfig.map(item => {
              return (
                <Center key={item.title} style={styles.NavItem}>
                  <View>{item.title}</View>
                  <Flex style={styles.NavItemBottom}>
                    <View style={styles.NavItemValue}>
                      {navInfo[item.dataIndex]}
                    </View>
                    <View style={styles.NavItemUnit}>{item.unit}</View>
                  </Flex>
                </Center>
              );
            })}
          </Flex>

          {/* 功能栏 */}
          <Flex wrap="wrap" style={styles.ActionWrapper}>
            {navList.map(item => {
              return (
                <TouchableOpacity
                  key={item.path}
                  style={styles.ActionItem}
                  onPress={() => fastJump(item.path)}>
                  <Image style={styles.ActionImg} source={iconObj[item.icon]} />
                  <View style={styles.ActionItemText}>{item.title}</View>
                </TouchableOpacity>
              );
            })}
          </Flex>
        </LayoutWrapper>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  homeFixBar: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
    height: 80,
    paddingTop: 40,
  },

  HomeBgc: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E9F9FB',
  },
  HomeScroll: {
    flex: 1,
  },
  HomeTitleWrapper: {
    marginTop: 26,
  },
  HomeTitle: {
    fontSize: 18,
    color: '#47AFFF',
    fontWeight: '600',
  },
  titleBgc: {
    width: 86,
    height: 32,
    justifyContent: 'center',
    paddingLeft: 6,
    marginLeft: -6,
  },
  HomeNavWrapper: {
    marginTop: 24,
    width: '100%',
    height: 75,
    backgroundColor: '#F0F9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ffffff',
  },
  NavItem: {
    flex: 1,
  },
  NavItemBottom: {
    marginTop: 4,
  },
  NavItemValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#47afff',
  },
  NavItemUnit: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '400',
    color: '#8e9ba6',
  },
  ActionWrapper: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#F0F9FD',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ffffff',
  },
  ActionItem: {
    width: '20%',
    height: 90,
    alignItems: 'center',
  },
  ActionImg: {
    width: 44,
    height: 44,
  },
  ActionItemText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomContainer: {
    marginTop: 30,
  },
  HomeBottomTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#273b5d',
  },
  HomeBottomRect: {
    width: 4,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#B0D3FF',
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
});

export default Home;
