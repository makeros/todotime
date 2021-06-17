port module Tasks exposing (..)

import BarChart
import Browser
import Css exposing (backgroundColor, height, hex, margin, pct, px)
import Css.Global exposing (body, global, html)
import Dict exposing (Dict)
import Html.Styled
    exposing
        ( Html
        , a
        , button
        , div
        , fromUnstyled
        , h1
        , styled
        , table
        , td
        , text
        , toUnstyled
        , tr
        )
import Html.Styled.Attributes exposing (class, href, rel, target, title)
import Html.Styled.Events exposing (onClick)
import Markdown
import Round
import String
import Time
import UI


port getTasksList : () -> Cmd msg


port tasksListCallback : (Model -> msg) -> Sub msg


main : Program FlagsModel Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = NoOp
    | NewTasksList Model
    | RefreshTasksList


type alias FlagsModel =
    { tasksList : TasksList
    , timeSeries : List ( Int, Float )
    }


type alias Model =
    { tasksList : TasksList
    , timeSeries : List ( Int, Float )
    }


type alias TasksList =
    List Task


type alias Task =
    { id : Int
    , content : String
    , completed : Bool
    , label_ids : List Int
    , todotime :
        { labels : List TaskCustomLabel
        }
    }


type alias TaskCustomLabel =
    { id : Int
    , name : String
    , value : Float
    }


init : Model -> ( Model, Cmd Msg )
init initModel =
    ( { tasksList = initModel.tasksList
      , timeSeries = initModel.timeSeries
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewTasksList newModel ->
            ( newModel, Cmd.none )

        RefreshTasksList ->
            ( model, getTasksList () )

        NoOp ->
            ( model, Cmd.none )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    tasksListCallback NewTasksList



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "Todotime • Tasks"
    , body =
        [ toUnstyled
            (global
                [ body
                    [ margin (px 0)
                    , backgroundColor (hex "f9f9f9")
                    ]
                , html [ height (pct 100) ]
                ]
            )
        , toUnstyled (viewMain model)
        ]
    }


viewMain : Model -> Html Msg
viewMain model =
    UI.containerMain []
        [ viewHistoryTimeline model.timeSeries
        , viewTasksList model.tasksList
        ]


viewTasksList : TasksList -> Html msg
viewTasksList tasksList =
    table [ class "uk-table", class "uk-table-striped" ]
        (List.map (\task -> viewTaskTr task) tasksList)


viewTaskTr : Task -> Html msg
viewTaskTr task =
    tr []
        [ td [] [ UI.valueCircle [] [ text (sumTaskValue task.todotime.labels |> String.fromFloat) ] ]
        , td []
            [ fromUnstyled (Markdown.toHtml [] task.content)
            ]
        ]


viewHistoryTimeline : List ( Int, Float ) -> Html msg
viewHistoryTimeline timeSeries =
    List.sortBy Tuple.first timeSeries
        |> List.map (\entry -> ( Time.millisToPosix (Tuple.first entry), Tuple.second entry ))
        |> BarChart.view


sumAllTasksValue : List Task -> Float
sumAllTasksValue tasksList =
    List.map (\task -> task.todotime.labels) tasksList
        |> List.concat
        |> sumTaskValue


sumTaskValue : List TaskCustomLabel -> Float
sumTaskValue labels =
    List.map (\label -> label.value) labels |> List.sum
