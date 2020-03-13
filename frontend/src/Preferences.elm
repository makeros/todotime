port module Preferences exposing (..)

import Browser
import Browser.Dom as Dom
import Css exposing (..)
import Css.Global exposing (body, global)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (value)
import Html.Styled.Events exposing (onClick)
import Json.Decode as Json
import Task


main : Program (Maybe Model) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


port saveUserSettings : Model -> Cmd msg


init : Maybe Model -> ( Model, Cmd Msg )
init maybeModel =
    ( Maybe.withDefault emptyModel maybeModel
    , Cmd.none
    )



--- Model


type alias Model =
    { apiKey : String
    , refreshTimeInterval : Int
    }


emptyModel : Model
emptyModel =
    { apiKey = ""
    , refreshTimeInterval = 0
    }



--- Update


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )



-- View


theme : { secondary : Color, primary : Color }
theme =
    { primary = hex "010101"
    , secondary = hex "f1f1f1"
    }


btnSave : List (Attribute msg) -> List (Html msg) -> Html msg
btnSave =
    styled button
        [ margin (px 12)
        , padding (px 8)
        , backgroundColor theme.primary
        , border (px 0)
        , color theme.secondary
        ]


inputField : List (Attribute msg) -> List (Html msg) -> Html msg
inputField =
    styled input
        [ padding (px 8)
        , width (pct 100)
        ]


view : Model -> Browser.Document Msg
view model =
    { title = "Timedoist • Preferences"
    , body =
        [ toUnstyled (global [ body [ margin (px 0) ] ])
        , toUnstyled (viewBody model)
        ]
    }


viewBody : Model -> Html Msg
viewBody model =
    div []
        [ h1 [] [ text "test" ]
        , section []
            [ div []
                [ inputField [ value model.apiKey ] []
                ]
            , div []
                [ btnSave [] [ text "Save" ]
                ]
            ]
        ]
