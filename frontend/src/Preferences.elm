port module Preferences exposing (..)

import Browser
import Browser.Dom as Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Keyed as Keyed
import Json.Decode as Json
import Task


main : Program (Maybe Model) Model Msg
main =
    Browser.document
        { init = init
        , view = \model -> { title = "Timedoist • Preferences", body = [ view model ] }
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


view : Model -> Html Msg
view model =
    div
        []
        [ h1 [] [ text "test" ]
        , section
            [ class "todoapp" ]
            [ text "test app" ]
        ]
