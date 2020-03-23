port module Preferences exposing (..)

-- import Html.Styled.Attributes exposing (value)
-- import Html.Styled.Events exposing (onClick, onInput)

import Array
import Browser
import Browser.Dom as Dom
import Css exposing (..)
import Css.Global exposing (body, global, html)
import Html exposing (..)
import Html.Attributes exposing (class, for, id, type_, value)
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
    , todoistLabel : String
    }


emptyPreferencesModel : PreferencesModel
emptyPreferencesModel =
    { apiKey = ""
    , refreshTimeInterval = 0
    , todoistLabel = ""
    }



--- Update


type Msg
    = NoOp
    | OnApiKeyInputChange String
    | OnRefreshIntervalInputChange String
    | OnTodoistLabelPrefixInputChange String
    | OnTodoistLabelSuffixInputChange String
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

        OnTodoistLabelPrefixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 0 }, Cmd.none )

        OnTodoistLabelSuffixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 1 }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


updateApiKey : PreferencesModel -> String -> PreferencesModel
updateApiKey model value =
    { model | apiKey = value }


updateTodoistLabel : PreferencesModel -> String -> Int -> PreferencesModel
updateTodoistLabel model value part =
    { model | todoistLabel = String.join "<minutes>" (Array.toList (Array.set part value (Array.fromList (String.split "<minutes>" model.todoistLabel)))) }


updateRefreshTimeInterval : PreferencesModel -> String -> PreferencesModel
updateRefreshTimeInterval model value =
    { model | refreshTimeInterval = Maybe.withDefault 0 (String.toFloat value) * 60000 }



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "Timedoist • Preferences"
    , body =
        [ toUnstyled
            (global
                [ body
                    [ margin (px 0)
                    , backgroundColor (hex "222")
                    , height (pct 100)
                    ]
                , html [ height (pct 100) ]
                ]
            )
        , viewBody model
        ]
    }


viewBody : Model -> Html Msg
viewBody model =
    div [ class "uk-section uk-section-secondary" ]
        [ section [ class "uk-container uk-container-large" ]
            [ h1 [] [ text "Preferences" ]
            , Html.form [ class "uk-form-horizontal uk-margin-large" ]
                [ div [ class "uk-margin" ]
                    [ label [ for "input-api-key", class "uk-form-label" ]
                        [ text "Todoist API Key:" ]
                    , div
                        [ class "uk-form-controls" ]
                        [ input [ id "input-api-key", class "uk-input uk-form-width-large", type_ "text", onInput OnApiKeyInputChange, value model.preferences.apiKey ] []
                        ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-refresh-interval", class "uk-form-label" ] [ text "Task refresh time:" ]
                    , div [ class "uk-form-controls" ]
                        [ input [ id "input-refresh-interval", class "uk-input uk-form-width-small", type_ "number", onInput OnRefreshIntervalInputChange, value (String.fromFloat (model.preferences.refreshTimeInterval / 60000)) ] []
                        ]
                    ]
                , div [ class "uk-margin" ]
                    [ label [ for "input-todoist-label", class "uk-form-label" ] [ text "Todoist label:" ]
                    , viewTodolistLabel model.preferences.todoistLabel
                    ]
                ]
            , div [ class "uk-margin uk-controls" ]
                [ button [ class "uk-button uk-button-primary uk-width-1-2", onClick OnPreferencesSave ] [ text "Save Preferences" ]
                ]
            ]
        ]


viewTodolistLabel : String -> Html Msg
viewTodolistLabel label =
    div [ class "uk-form-controls" ]
        [ input [ id "input-todoist-label", class "uk-input uk-form-width-small", type_ "text", onInput OnTodoistLabelPrefixInputChange, value (Maybe.withDefault "" (Array.get 0 (Array.fromList (String.split "<minutes>" label)))) ] []
        , text "<minutes>"
        , input [ id "input-todoist-label", class "uk-input uk-form-width-small", type_ "text", onInput OnTodoistLabelSuffixInputChange, value (Maybe.withDefault "" (Array.get 1 (Array.fromList (String.split "<minutes>" label)))) ] []
        , div [ class "uk-text-muted" ] [ text "Todoist label example: ", span [ class "uk-text-success" ] [ text "@", text (String.replace "<minutes>" "120" label) ] ]
        ]
