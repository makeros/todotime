--port module Main exposing (..)


module Tasks exposing (main, view)

import Browser
import Browser.Dom as Dom
import Css exposing (..)
import Css.Global exposing (body, global, html)
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, disabled, for, id, type_, value)
import Html.Events exposing (..)
import Html.Styled exposing (toUnstyled)
import Json.Decode as JD
import Json.Encode as JE
import Task


main : Program (Maybe FlagsModel) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = NoOp


type alias FlagsModel =
    { tasksList : List Task
    , timeLineHistory : List TimelineHistoryEntry
    }


type alias Model =
    { tasksList : TasksList
    , timeLineHistory : TimelineHistory
    }


type alias TasksList =
    Dict String Task


type alias Task =
    { id : Int
    , content : String
    , completed : Bool
    , label_ids : List Int
    , todotime : List CustomLabel
    }


type alias CustomLabel =
    { id : Int
    , name : String
    , value : Int
    }


type alias TimelineHistory =
    Dict String TimelineHistoryEntry


type alias TimelineHistoryEntry =
    {}


init : Maybe Model -> ( Model, Cmd Msg )
init maybeModel =
    ( { tasksList = Dict.empty
      , timeLineHistory = Dict.empty
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



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
        , h1 [] [ text "Hello Tasks" ]
        , button [] [ text "Refresh data" ]
        ]
    }
