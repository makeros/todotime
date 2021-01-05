/* eslint-env jest */
const { daily } = require('./index.js')
const httpsRequest = require('./../https-request')

jest.mock('./../https-request')

describe('daily completed task history', () => {
  let requestGet, settingsStore
  beforeEach(() => {
    requestGet = jest.fn()
    httpsRequest.mockReturnValue({
      get: requestGet
    })
    settingsStore = {
      get: jest.fn()
    }
  })

  it('should return the amount of time (points) calculated for each day ', async () => {
    settingsStore.get.mockImplementation(storeKey => {
      switch (storeKey) {
        case 'todoistLabel':
          return 't<minutes>'
      }
    })
    requestGet
      .mockImplementation(url => {
        switch (url) {
          case 'https://api.todoist.com/sync/v8/activity/get?event_type=completed&page=0':
            return Promise.resolve(fixturePage0)
          case 'https://api.todoist.com/sync/v8/activity/get?event_type=completed&page=1':
            return Promise.resolve(fixturePage1)
          case 'https://api.todoist.com/sync/v8/activity/get?event_type=completed&page=2':
            return Promise.resolve(fixturePage2)
          case 'https://api.todoist.com/rest/v1/labels':
            return Promise.resolve(fixtureLabels)
        }

        if (url.startsWith('https://api.todoist.com/rest/v1/tasks?ids')) {
          return Promise.resolve(fixtureGetTasks)
        }
      })

    const result = await daily({ authKey: '1234', settingsStore }, { weeks: 2 })
    expect(result).toEqual({
      1608508800000: 4,
      1608854400000: 16,
      1609113600000: 2,
      1609200000000: 12,
      1609286400000: 1
    })
  })

  it.todo('should throw error when activity fetching failed')
  it.todo('should throw error when even one task could not be downloaded')
})

var fixturePage0 = {
  count: 9,
  events: [
    {
      event_date: '2020-12-30T22:39:43Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10632079683,
      initiator_id: null,
      object_id: 4348445982,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2227238647
    },
    {
      event_date: '2020-12-29T22:08:27Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10623635734,
      initiator_id: null,
      object_id: 4354083679,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212601965
    },
    {
      event_date: '2020-12-29T22:07:47Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10623631556,
      initiator_id: null,
      object_id: 4432854888,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212360029
    },
    {
      event_date: '2020-12-29T09:55:21Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10618297391,
      initiator_id: null,
      object_id: 4433694473,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2241254926
    },
    {
      event_date: '2020-12-29T08:27:15Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10617715409,
      initiator_id: null,
      object_id: 3664338111,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2218685093
    },
    {
      event_date: '2020-12-28T23:05:25Z',
      event_type: 'completed',
      extra_data: {
        client: 'Todoist-Android/16.3.3',
        content: 'test_content'
      },
      id: 10615335603,
      initiator_id: null,
      object_id: 4444858268,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2249954854
    },
    {
      event_date: '2020-12-28T21:39:07Z',
      event_type: 'completed',
      extra_data: {
        client: 'Todoist-Android/16.3.3',
        content: 'test_content'
      },
      id: 10614770511,
      initiator_id: null,
      object_id: 4348445982,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2227238647
    },
    {
      event_date: '2020-12-28T13:44:41Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10610877377,
      initiator_id: null,
      object_id: 4358637658,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2250898885
    },
    {
      event_date: '2020-12-28T10:11:12Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10609206485,
      initiator_id: null,
      object_id: 4419635529,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212601965
    }
  ]
}

var fixturePage1 = {
  count: 10,
  events: [
    {
      event_date: '2020-12-25T22:34:02Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10595325769,
      initiator_id: null,
      object_id: 4348445982,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2227238647
    },
    {
      event_date: '2020-12-25T22:33:43Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10595324956,
      initiator_id: null,
      object_id: 3523298514,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2218685093
    },
    {
      event_date: '2020-12-25T22:33:43Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10595324935,
      initiator_id: null,
      object_id: 3447791385,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2218685093
    },
    {
      event_date: '2020-12-25T22:33:43Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10595324925,
      initiator_id: null,
      object_id: 3473144368,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2218685093
    },
    {
      event_date: '2020-12-21T23:11:52Z',
      event_type: 'completed',
      extra_data: {
        client: 'Todoist-Android/16.3.0',
        content: 'test_content'
      },
      id: 10566031886,
      initiator_id: null,
      object_id: 4430572229,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212360029
    },
    {
      event_date: '2020-12-21T13:51:51Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10561141328,
      initiator_id: null,
      object_id: 4210882358,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2241630280
    },
    {
      event_date: '2020-12-21T12:56:34Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10560621421,
      initiator_id: null,
      object_id: 4358637658,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2250898885
    },
    {
      event_date: '2020-12-21T10:37:49Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1064',
        content: 'test_content'
      },
      id: 10559405769,
      initiator_id: null,
      object_id: 4419932080,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212469879
    },
    {
      event_date: '2020-12-21T09:01:43Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1063',
        content: 'test_content'
      },
      id: 10558587834,
      initiator_id: null,
      object_id: 4421097774,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212360029
    },
    {
      event_date: '2020-12-21T08:59:01Z',
      event_type: 'completed',
      extra_data: {
        client: 'Mozilla/5.0; Todoist/1063',
        content: 'test_content'
      },
      id: 10558561395,
      initiator_id: null,
      object_id: 4426267260,
      object_type: 'item',
      parent_item_id: null,
      parent_project_id: 2212360029
    }
  ]
}

var fixturePage2 = {}

var fixtureGetTasks = [
  {
    id: 4348445982,
    assigner: 0,
    project_id: 2227238647,
    section_id: 0,
    order: 33,
    content: 'Uzupełnić habits',
    completed: false,
    label_ids: [
      2153357532,
      2155617711
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-19T11:27:48Z',
    due: {
      recurring: true,
      string: 'co dzień o 22',
      date: '2020-12-31',
      datetime: '2020-12-31T21:00:00Z',
      timezone: 'Europe/Warsaw'
    },
    url: 'https://todoist.com/showTask?id=4348445982'
  },
  {
    id: 4354083679,
    assigner: 0,
    project_id: 2212601965,
    section_id: 0,
    order: 7,
    content: 'Zlac wina',
    completed: false,
    label_ids: [
      2154101505
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-21T16:22:49Z',
    due: {
      recurring: true,
      string: 'co dzień',
      date: '2020-12-30'
    },
    url: 'https://todoist.com/showTask?id=4354083679'
  },
  {
    id: 4432854888,
    assigner: 0,
    project_id: 2212360029,
    section_id: 0,
    order: 149,
    content: 'Kupić bilet na kanary',
    completed: false,
    label_ids: [
      2154101505
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-12-22T07:13:43Z',
    due: {
      recurring: true,
      string: 'co drugi dzień',
      date: '2021-01-01'
    },
    url: 'https://todoist.com/showTask?id=4432854888'
  },
  {
    id: 3664338111,
    assigner: 0,
    project_id: 2218685093,
    section_id: 1821414,
    order: 5,
    content: 'Podlać kwiatki',
    completed: false,
    label_ids: [
      2153357532,
      2154047933
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-02-01T12:30:15Z',
    due: {
      recurring: true,
      string: 'every saturday',
      date: '2021-01-02'
    },
    url: 'https://todoist.com/showTask?id=3664338111'
  },
  {
    id: 4348445982,
    assigner: 0,
    project_id: 2227238647,
    section_id: 0,
    order: 33,
    content: 'Uzupełnić habits',
    completed: false,
    label_ids: [
      2153357532,
      2155617711
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-19T11:27:48Z',
    due: {
      recurring: true,
      string: 'co dzień o 22',
      date: '2020-12-31',
      datetime: '2020-12-31T21:00:00Z',
      timezone: 'Europe/Warsaw'
    },
    url: 'https://todoist.com/showTask?id=4348445982'
  },
  {
    id: 4358637658,
    assigner: 0,
    project_id: 2250898885,
    section_id: 0,
    order: 1,
    content: 'posprzątać kuwetę',
    completed: false,
    label_ids: [
      2155617711
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-23T15:37:36Z',
    due: {
      recurring: true,
      string: 'co 2 dni o 21',
      date: '2021-01-01',
      datetime: '2021-01-01T20:00:00Z',
      timezone: 'Europe/Warsaw'
    },
    url: 'https://todoist.com/showTask?id=4358637658'
  },
  {
    id: 4348445982,
    assigner: 0,
    project_id: 2227238647,
    section_id: 0,
    order: 33,
    content: 'Uzupełnić habits',
    completed: false,
    label_ids: [
      2153357532,
      2155617711
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-19T11:27:48Z',
    due: {
      recurring: true,
      string: 'co dzień o 22',
      date: '2020-12-31',
      datetime: '2020-12-31T21:00:00Z',
      timezone: 'Europe/Warsaw'
    },
    url: 'https://todoist.com/showTask?id=4348445982'
  },
  {
    id: 3523298514,
    assigner: 0,
    project_id: 2218685093,
    section_id: 1821414,
    order: 2,
    content: 'Umyć łazienkę',
    completed: false,
    label_ids: [
      2153357532,
      2154101505
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2019-11-22T06:56:02Z',
    due: {
      recurring: true,
      string: 'every friday',
      date: '2021-01-01'
    },
    url: 'https://todoist.com/showTask?id=3523298514'
  },
  {
    id: 3447791385,
    assigner: 23002750,
    project_id: 2218685093,
    section_id: 1821414,
    order: 4,
    content: 'Odkurzanie',
    completed: false,
    label_ids: [
      2153357532,
      2154101505
    ],
    priority: 1,
    comment_count: 0,
    creator: 0,
    created: '2019-10-13T14:46:37Z',
    due: {
      recurring: true,
      string: 'co piątek',
      date: '2021-01-01'
    },
    url: 'https://todoist.com/showTask?id=3447791385'
  },
  {
    id: 3473144368,
    assigner: 23002750,
    project_id: 2218685093,
    section_id: 1821414,
    order: 3,
    content: 'Umyć podłogi',
    completed: false,
    label_ids: [
      2153357532,
      2154101505
    ],
    priority: 1,
    comment_count: 0,
    creator: 0,
    created: '2019-10-27T11:03:09Z',
    due: {
      recurring: true,
      string: 'co piątek',
      date: '2021-01-01'
    },
    url: 'https://todoist.com/showTask?id=3473144368'
  },
  {
    id: 4210882358,
    assigner: 0,
    project_id: 2241630280,
    section_id: 0,
    order: 60,
    content: 'inspekcja githuba',
    completed: false,
    label_ids: [
      2154047935
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-09-28T12:00:59Z',
    due: {
      recurring: true,
      string: 'w każdy poniedziałek',
      date: '2021-01-04'
    },
    url: 'https://todoist.com/showTask?id=4210882358'
  },
  {
    id: 4358637658,
    assigner: 0,
    project_id: 2250898885,
    section_id: 0,
    order: 1,
    content: 'posprzątać kuwetę',
    completed: false,
    label_ids: [
      2155617711
    ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2020-11-23T15:37:36Z',
    due: {
      recurring: true,
      string: 'co 2 dni o 21',
      date: '2021-01-01',
      datetime: '2021-01-01T20:00:00Z',
      timezone: 'Europe/Warsaw'
    },
    url: 'https://todoist.com/showTask?id=4358637658'
  }
]

var fixtureLabels = [
  {
    id: 2152808818,
    name: 'oddać',
    order: 1,
    color: 47,
    favorite: false
  },
  {
    id: 2152733213,
    name: 'zakupy',
    order: 3,
    color: 47,
    favorite: false
  },
  {
    id: 2153357532,
    name: 'cykliczne',
    order: 4,
    color: 47,
    favorite: false
  },
  {
    id: 2153369158,
    name: 'sprzedać',
    order: 5,
    color: 47,
    favorite: false
  },
  {
    id: 2153968285,
    name: 'diy',
    order: 6,
    color: 47,
    favorite: false
  },
  {
    id: 2154047933,
    name: 't2',
    order: 7,
    color: 35,
    favorite: false
  },
  {
    id: 2154047935,
    name: 't3',
    order: 8,
    color: 34,
    favorite: false
  },
  {
    id: 2154101505,
    name: 't5',
    order: 9,
    color: 33,
    favorite: false
  },
  {
    id: 2154047942,
    name: 't8',
    order: 10,
    color: 32,
    favorite: false
  },
  {
    id: 2154104432,
    name: 't13',
    order: 11,
    color: 31,
    favorite: false
  },
  {
    id: 2154103651,
    name: 't20',
    order: 12,
    color: 30,
    favorite: false
  },
  {
    id: 2154470936,
    name: 't40',
    order: 13,
    color: 39,
    favorite: false
  },
  {
    id: 2154341091,
    name: 'idea',
    order: 16,
    color: 47,
    favorite: false
  },
  {
    id: 2154489909,
    name: 'sklep-budowlany',
    order: 17,
    color: 47,
    favorite: false
  },
  {
    id: 2154964935,
    name: 'long-run',
    order: 18,
    color: 47,
    favorite: false
  },
  {
    id: 2155533743,
    name: 'nina',
    order: 19,
    color: 47,
    favorite: false
  },
  {
    id: 2155592444,
    name: '_t-1',
    order: 31,
    color: 47,
    favorite: false
  },
  {
    id: 2155617711,
    name: 't1',
    order: 32,
    color: 47,
    favorite: false
  }
]
