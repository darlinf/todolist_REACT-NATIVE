import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import HeaderMenuContext from '../context/HeaderMenu/HeaderMenuContext';
import COLOR from '../constants/theme';
import db from '../database/db';

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import SelectDropdown from 'react-native-select-dropdown';

let isOnScreenNavbar = true;

export default function EditTask({route, navigation}) {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [showPopUp, setShowPopUp] = useState(false);

  const [dateT, setDateT] = useState(null);
  const [time, setTime] = useState(null);

  const initalState = {
    task: '',
    taskState: '',
    timeStart: '',
    timeEnd: '',
    alartRepeat: '',
    typeTask: '',
    date: '',
    task_id: '',
  };

  let deviceHeight = Dimensions.get('screen').height;
  let windowHeight = Dimensions.get('window').height;
  let bottomNavBarHeight = deviceHeight - windowHeight;
  if (!bottomNavBarHeight > 0) {
    isOnScreenNavbar = false;
  }

  const headerMenuContext = useContext(HeaderMenuContext);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      headerMenuContext.editNotePage();
      console.log('dddddddddddddddd');
      console.log(route.params);
      initalState.task = route.params.task;
      initalState.taskState = route.params.taskState;
      initalState.timeStart = route.params.timeStart;
      initalState.timeEnd = route.params.timeEnd;
      initalState.alartRepeat = route.params.alartRepeat;
      initalState.typeTask = route.params.typeTask;
      initalState.date = route.params.date;
      initalState.task_id = route.params.task_id;

      setDateT(route.params.date);
      setTime(route.params.timeStart);
    });
    return unsubscribe;
  }, [navigation]);

  const popUpEnable = () => {
    setShowPopUp(true);
    setDateT(null);
    setTime(null);
    setTimeout(() => {
      setShowPopUp(false);
    }, 2000);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(mode);
    if (mode === 'time') {
      setTime(date.toString().slice(16, 24));
      handleChangeText(time, 'timeStart');
    }
    if (mode === 'date') {
      setDateT(date.toString().slice(0, 16));
      handleChangeText(dateT, 'date');
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const [state, setState] = useState(initalState);
  const handleChangeText = (value, name) => {
    setState({...state, [name]: value});
  };
  const saveNewTask = () => {
    db.editTask(resurt => {
      console.log(resurt);
    }, state);
    navigation.navigate('Home');
  };

  const menu = useRef();
  const hideMenu = () => menu.current.hide();
  const showMenu = () => menu.current.show();
  const [darkMode, setDarkMode] = React.useState(true);

  const headerMenu = () => {
    return (
      <View style={{height: 150, backgroundColor: COLOR.primary}}>
        <View
          style={{
            backgroundColor: COLOR.primary,
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 50,
            height: '65%',
          }}>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Menu
                  ref={menu}
                  button={
                    <TouchableOpacity
                      onPress={() => {
                        showMenu();
                      }}>
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={require('../assets/menu.png')}
                          resizeMode="contain"
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: 'white',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  }>
                  <MenuItem onPress={hideMenu}>Menu item 1</MenuItem>
                  <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
                  <MenuItem onPress={hideMenu} disabled>
                    Menu item 3
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={hideMenu}>Menu item 4</MenuItem>
                </Menu>
              </View>

              <Text style={{color: 'white', fontSize: 24, top: -7}}>
                Edit task
              </Text>

              <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {!darkMode && (
                    <Image
                      source={require('../assets/dark-mode.png')}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: 'white',
                      }}
                    />
                  )}
                  {darkMode && (
                    <Image
                      source={require('../assets/day-mode.png')}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: 'white',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopStartRadius: 50,
            height: '35%',
          }}></View>
      </View>
    );
  };

  return (
    <View>
      {headerMenu()}
      <View
        style={{
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: '#FFFFFF',
          height: '100%',
          width: '100%',
        }}>
        {/** 
      <Text>{state.task + ' : ' + 'task'}</Text>
      <Text>{state.taskState + ' : ' + 'taskState'}</Text>
      <Text>{state.timeStart + ' : ' + 'timeStart'}</Text>
      <Text>{state.timeEnd + ' : ' + 'timeEnd'}</Text>
      <Text>{state.alartRepeat + ' : ' + 'alartRepeat'}</Text>
      <Text>{state.typeTask + ' : ' + 'typeTask'}</Text>
      <Text>{state.date + ' : ' + 'date'}</Text>
*/}
        {showPopUp && (
          <View
            style={{
              width: '80%',
              height: 50,
              backgroundColor: '#EBF7EE',
              position: 'absolute',
              top: isOnScreenNavbar ? 450 : 497,
              left: 49,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#c0ebcb',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                lineHeight: 50,
                fontSize: 20,
              }}>
              Task created
            </Text>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: '#EBF7EE',
                position: 'absolute',
                top: 14,
                left: 267,
                transform: [{rotate: '45deg'}],
                borderTopRightRadius: 2,
                borderWidth: 1,
                borderColor: '#c0ebcb',
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              }}></View>
          </View>
        )}

        <TouchableOpacity
          style={{
            borderRadius: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOR.primary,
            height: 55,
            width: 55,
            top: isOnScreenNavbar ? 448 : 495,
            left: 350,
            position: 'absolute',
            zIndex: 1,
          }}
          onPress={() => {
            saveNewTask();
          }}>
          <Image
            source={require('../assets/check.png')}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>
        {/*<Text style={{textAlign: 'center', fontSize: 20}}>Create Task</Text> */}
        <View>
          <Text>What is to be done?</Text>
          <TextInput
            style={{
              borderRadius: 13,
              backgroundColor: COLOR.secondary,
              color: 'black',
              fontSize: 20,
              height: 50,
              marginBottom: 20,
            }}
            value={state.task}
            onChangeText={value => handleChangeText(value, 'task')}
          />
        </View>
        {/*date picker*/}
        <View>
          <Text>Date picker</Text>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                showDatepicker();
                handleChangeText('still', 'taskState');
                console.log('dfasf');
              }}>
              <View
                style={{
                  height: 50,
                  backgroundColor: COLOR.secondary,
                  borderRadius: 13,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text style={{fontSize: 20}}> {dateT}</Text>
                <Image
                  source={require('../assets/calendar.png')}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: COLOR.primary,
                  }}
                />
              </View>
            </TouchableOpacity>
            {dateT && (
              <TouchableOpacity
                style={{marginRight: 5}}
                onPress={() => {
                  setDateT(null);
                }}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: COLOR.secondary,
                    borderRadius: 13,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../assets/close.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: COLOR.primary,
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          {/*Time picker*/}
          {dateT && (
            <View>
              <Text>Time picker</Text>
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: 'row-reverse',
                }}>
                {time && (
                  <TextInput
                    style={{
                      borderRadius: 13,
                      backgroundColor: COLOR.secondary,
                      color: 'black',
                      fontSize: 20,
                      height: 50,
                      width: 50,
                      marginLeft: 5,
                      textAlign: 'center',
                    }}
                    value={state.timeEnd}
                    onChangeText={value => handleChangeText(value, 'timeEnd')}
                  />
                )}
                <TouchableOpacity style={{flex: 1}} onPress={showTimepicker}>
                  <View
                    style={{
                      height: 50,
                      backgroundColor: COLOR.secondary,
                      borderRadius: 13,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Text style={{fontSize: 20}}>{time}</Text>
                    <Image
                      source={require('../assets/wall-clock.png')}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: COLOR.primary,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {time && (
                  <TouchableOpacity
                    style={{marginRight: 5}}
                    onPress={() => {
                      setTime(null);
                    }}>
                    <View
                      style={{
                        height: 50,
                        backgroundColor: COLOR.secondary,
                        borderRadius: 13,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../assets/close.png')}
                        resizeMode="contain"
                        style={{
                          width: 25,
                          height: 25,
                          tintColor: COLOR.primary,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        {/**/}
        {time && (
          <View style={{marginBottom: 20}}>
            <Text>Repaet</Text>
            <SelectDropdown
              renderDropdownIcon={() => {
                return (
                  <Image
                    source={require('../assets/up-arrow.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: COLOR.primary,
                      position: 'absolute',
                      left: 10,
                    }}
                  />
                );
              }}
              defaultButtonText={state.alartRepeat}
              dropdownStyle={{height: 350}}
              data={[
                'No repeat',
                'Once a day',
                'Once a day (Mon-Fri)',
                'Once a week',
                'Once a month',
                'Once a year',
                'Other...',
              ]}
              onSelect={(selectedItem, index) => {
                handleChangeText(selectedItem, 'alartRepeat');
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        )}
        <View>
          <Text>Add to list</Text>
          <SelectDropdown
            renderDropdownIcon={() => {
              return (
                <Image
                  source={require('../assets/up-arrow.png')}
                  resizeMode="contain"
                  style={{
                    width: 15,
                    height: 15,
                    tintColor: COLOR.primary,
                    position: 'absolute',
                    left: 10,
                  }}
                />
              );
            }}
            defaultButtonText={state.typeTask}
            dropdownStyle={{height: 250}}
            data={['Default', 'Personal', 'Shopping', 'Wishlist', 'Word']}
            onSelect={(selectedItem, index) => {
              handleChangeText(selectedItem, 'typeTask');
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </View>
      </View>
    </View>
  );
}
