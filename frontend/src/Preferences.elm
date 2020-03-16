port module Preferences exposing (..)

-- import Html.Styled.Attributes exposing (value)
-- import Html.Styled.Events exposing (onClick, onInput)

import Browser
import Browser.Dom as Dom
import Css exposing (..)
import Css.Global exposing (body, global)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Styled exposing (toUnstyled)
import Json.Decode as JD
import Json.Encode as JE
import Task



-- import UI


port userSettingsSave : PreferencesModel -> Cmd msg


main : Program (Maybe PreferencesModel) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


init : Maybe PreferencesModel -> ( Model, Cmd Msg )
init maybePreferencesModel =
    ( { preferences = Maybe.withDefault emptyPreferencesModel maybePreferencesModel
      , saving = False
      }
    , Cmd.none
    )



--- Model


type alias Model =
    { preferences : PreferencesModel
    , saving : Bool
    }


type alias PreferencesModel =
    { apiKey : String
    , refreshTimeInterval : Float
    }


emptyPreferencesModel : PreferencesModel
emptyPreferencesModel =
    { apiKey = ""
    , refreshTimeInterval = 0
    }



--- Update


type Msg
    = NoOp
    | OnApiKeyInputChange String
    | OnRefreshIntervalInputChange String
    | OnPreferencesSave


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnPreferencesSave ->
            ( model, userSettingsSave model.preferences )

        OnApiKeyInputChange value ->
            ( { model | preferences = updateApiKey model.preferences value }, Cmd.none )

        OnRefreshIntervalInputChange value ->
            ( { model | preferences = updateRefreshTimeInterval model.preferences value }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


updateApiKey : PreferencesModel -> String -> PreferencesModel
updateApiKey model value =
    { model | apiKey = value }


updateRefreshTimeInterval : PreferencesModel -> String -> PreferencesModel
updateRefreshTimeInterval model value =
    { model | refreshTimeInterval = Maybe.withDefault 0 (String.toFloat value) * 60000 }



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "Timedoist • Preferences"
    , body =
        [ toUnstyled (global [ body [ margin (px 0) ] ])
        , viewBody model
        ]
    }


viewBody : Model -> Html Msg
viewBody model =
    div [ class "uk-margin" ]
        [ h1 [] [ text "test" ]
        , section []
            [ Html.form [ class "uk-form-horizontal uk-margin-large" ]
                [ div [ class "uk-margin" ]
                    [ label [ for "input-api-key", class "uk-form-label" ]
                        [ text "Todoist API Key" ]
                    , div
                        [ class "uk-form-controls" ]
                        [ input [ id "input-api-key", class "uk-input", type_ "text", onInput OnApiKeyInputChange, value model.preferences.apiKey ] []
                        ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-refresh-interval", class "uk-form-label" ] [ text "Task refresh time" ]
                    , div [ class "uk-form-controls" ]
                        [ input [ id "input-refresh-interval", class "uk-input", type_ "text", onInput OnRefreshIntervalInputChange, value (String.fromFloat (model.preferences.refreshTimeInterval / 60000)) ] []
                        ]
                    ]
                ]
            , div [ class "uk-margin" ]
                [ button [ class "uk-button uk-button-primary", onClick OnPreferencesSave ] [ text "Save Preferences" ]
                ]
            ]
        ]
