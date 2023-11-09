export const defaultEditorContent2 = {
  type: "doc",

  content: [
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "RPA POC 테스트 문서 "
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "첫번째 방법 : '/조건' '/액션' '/레시피' 입력으로 설정 창에서 옵션을 지정하여 문장을 생성시킨다. "
            }
          ]
        }
      ]
    },
    {
      "type": "conditionRule",
      "attrs": {
        "fac": "Comp Motor",
        "tag": "Winding Temp",
        "temp": "50",
        "unit": "℃",
        "range": "미만",
        "memo": "모터 권선이 소손되지 않도록 주의"
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Comp Motor",
                "title": "설비"
              }
            }
          ],
          "text": "Comp Motor"
        },
        {
          "type": "text",
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Winding Temp",
                "title": "태그"
              }
            }
          ],
          "text": "Winding Temp"
        },
        {
          "type": "text",
          "text": "를 50℃ 미만 모터 권선이 소손되지 않도록 주의"
        }
      ]
    },
    {
      "type": "conditionRule",
      "attrs": {
        "fac": "Receiver Tank",
        "tag": "Press",
        "temp": "5",
        "unit": "℃",
        "range": "미만",
        "memo": ""
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Receiver Tank",
                "title": "설비"
              }
            }
          ],
          "text": "Receiver Tank"
        },
        {
          "type": "text",
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Press",
                "title": "태그"
              }
            }
          ],
          "text": "Press"
        },
        {
          "type": "text",
          "text": "를 5℃ 미만 "
        }
      ]
    },
    {
      "type": "conditionRule",
      "attrs": {
        "fac": "After Cooler",
        "tag": "Status",
        "temp": "0",
        "unit": "℃",
        "range": "이상",
        "memo": ""
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "After Cooler",
                "title": "설비"
              }
            }
          ],
          "text": "After Cooler"
        },
        {
          "type": "text",
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Status",
                "title": "태그"
              }
            }
          ],
          "text": "Status"
        },
        {
          "type": "text",
          "text": "를 이상 "
        }
      ]
    },
    {
      "type": "actionRule",
      "attrs": {
        "tag": "Status",
        "temp": "0",
        "unit": "℃",
        "range": "init",
        "memo": ""
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Air Compressor",
                "title": "설비"
              }
            }
          ],
          "text": "Air Compressor"
        },
        {
          "type": "text",
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Status",
                "title": "태그"
              }
            }
          ],
          "text": "Status"
        },
        {
          "type": "text",
          "text": "를 init "
        }
      ]
    },
    {
      "type": "recipeRule",
      "attrs": {
        "recipeName": "레시피 이름",
        "action": "Air Compressor의 Status를 init ",
        "andCondition": "Comp Motor의 Winding Temp를 50℃ 미만 모터 권선이 소손되지 않도록 주의$Receiver Tank의 Press를 5℃ 미만 $After Cooler의 Status를 이상 ",
        "orCondition": "",
        "alarmMsg": "모터 확인 바랍니다.",
        "alarmMsgTo": "홍길동",
        "auto": false,
        "activated": false
      },
      "content": [
        {
          "type": "heading",
          "attrs": {
            "level": 2
          },
          "content": [
            {
              "type": "text",
              "text": "레시피 이름"
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Air Compressor의 Status를 init  액션을 실행하기 위해 아래 조건들이 충족되어야 한다."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "AND조건"
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "▶ Comp Motor의 Winding Temp를 50℃ 미만 모터 권선이 소손되지 않도록 주의"
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "▶ Receiver Tank의 Press를 5℃ 미만 "
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "▶ After Cooler의 Status를 이상 "
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "조건 불일치시 알람 메세지로는 \"모터 확인 바랍니다.\"으로 설정하여"
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "담당자 홍길동에게 알람을 전달한다."
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "두번째 방법 : Free Text Style로 드래그하여 '조건' 또는 '액션'의 영역으로 지정한다."
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "레시피 이름 : Air Compressor에 대한 노하우 레시피"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Comp Motor",
                "title": "설비"
              }
            }
          ],
          "text": "Comp Motor"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": "에 대한 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Winding Temp",
                "title": "태그"
              }
            }
          ],
          "text": "Winding Temp"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": " 의 온도를 50도 미만으로 만들어"
        },
        {
          "type": "text",
          "text": " 모터 권선이 소손되지 않도록 주의해야 하며, "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Receiver Tank",
                "title": "설비"
              }
            }
          ],
          "text": "Receiver Tank"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Press",
                "title": "태그"
              }
            }
          ],
          "text": "Press"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": "가 3.5bar 미만"
        },
        {
          "type": "text",
          "text": "이고 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "After Cooler",
                "title": "설비"
              }
            }
          ],
          "text": "After Cooler"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": "의 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            },
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Status",
                "title": "태그"
              }
            }
          ],
          "text": "Status"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-gray)"
              }
            },
            {
              "type": "markCondition",
              "attrs": {
                "markCondition": "조건",
                "color": "#ebebee"
              }
            }
          ],
          "text": "가 가동"
        },
        {
          "type": "text",
          "text": "되어야 한다. 이 조건을 모두 만족했을 때 "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-yellow)"
              }
            },
            {
              "type": "facilityMark",
              "attrs": {
                "facility": "Air Compressor",
                "title": "설비"
              }
            }
          ],
          "text": "Air Compressor"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-yellow)"
              }
            }
          ],
          "text": " "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-yellow)"
              }
            },
            {
              "type": "tagMark",
              "attrs": {
                "tag": "Status",
                "title": "태그"
              }
            }
          ],
          "text": "Status"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "highlight",
              "attrs": {
                "color": "var(--novel-highlight-yellow)"
              }
            }
          ],
          "text": " 를 가동한다."
        },
        {
          "type": "text",
          "text": "   "
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph"
    }
  ]
}
