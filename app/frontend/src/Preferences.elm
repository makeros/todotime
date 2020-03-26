port module Preferences exposing (..)

-- import Html.Styled.Attributes exposing (value)
-- import Html.Styled.Events exposing (onClick, onInput)

import Array
import Browser
import Browser.Dom as Dom
import Css exposing (..)
import Css.Global exposing (body, global, html)
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, disabled, for, id, type_, value)
import Html.Events exposing (..)
import Html.Styled exposing (toUnstyled)
import Json.Decode as JD
import Json.Encode as JE
import Task



-- import UI
-- TODO: create just one port for IN and one port for OUT


port userSettingsSave : PreferencesModel -> Cmd msg


port checkTodoistPremiumCallback : (Bool -> msg) -> Sub msg


port checkTodoistPremium : String -> Cmd msg


port closeWindow : () -> Cmd msg


main : Program (Maybe PreferencesModel) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Maybe PreferencesModel -> ( Model, Cmd Msg )
init maybePreferencesModel =
    ( { preferences = Maybe.withDefault emptyPreferencesModel maybePreferencesModel
      , saving = False
      , todoistPremiumChecking = False
      }
    , Cmd.none
    )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    checkTodoistPremiumCallback TodoistPremiumChanged



--- Model


type alias Model =
    { preferences : PreferencesModel
    , saving : Bool
    , todoistPremiumChecking : Bool
    }


type alias TodoistStateModel =
    { isPremium : Bool
    }


type alias PreferencesModel =
    { apiKey : String
    , refreshTimeInterval : Float
    , todoistLabel : String
    , isTodoistPremium : Bool
    }


emptyPreferencesModel : PreferencesModel
emptyPreferencesModel =
    { apiKey = ""
    , refreshTimeInterval = 0
    , todoistLabel = ""
    , isTodoistPremium = False
    }



--- Update


type Msg
    = NoOp
    | OnApiKeyInputChange String
    | OnRefreshIntervalInputChange String
    | OnTodoistLabelPrefixInputChange String
    | OnTodoistLabelSuffixInputChange String
    | OnPreferencesSave
    | TodoistPremiumChanged Bool
    | OnTodoistPremiumCheckClick
    | OnWindowCLoseClick


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnPreferencesSave ->
            ( model, userSettingsSave model.preferences )

        OnApiKeyInputChange value ->
            ( { model | preferences = updateApiKey model.preferences value }, Task.succeed OnTodoistPremiumCheckClick |> Task.perform identity )

        OnRefreshIntervalInputChange value ->
            ( { model | preferences = updateRefreshTimeInterval model.preferences value }, Cmd.none )

        OnTodoistLabelPrefixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 0 }, Cmd.none )

        OnTodoistLabelSuffixInputChange value ->
            ( { model | preferences = updateTodoistLabel model.preferences value 1 }, Cmd.none )

        TodoistPremiumChanged isPremium ->
            ( { model | preferences = updateTodoistPremium model.preferences isPremium, todoistPremiumChecking = False }, Cmd.none )

        OnTodoistPremiumCheckClick ->
            ( { model | todoistPremiumChecking = True }, checkTodoistPremium model.preferences.apiKey )

        OnWindowCLoseClick ->
            ( model, closeWindow () )

        NoOp ->
            ( model, Cmd.none )


updateTodoistPremium : PreferencesModel -> Bool -> PreferencesModel
updateTodoistPremium model value =
    { model | isTodoistPremium = value }


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
                    , backgroundColor (hex "f9f9f9")
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
    div [ class "uk-section" ]
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
                    [ label [ for "btn-check-premium", class "uk-form-label" ] [ text "Todoist Premium check:" ]
                    , div []
                        [ viewCheckTodoisPremium model.preferences.isTodoistPremium model.todoistPremiumChecking ]
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
                [ button [ class "uk-button uk-button-default uk-width-1-2", onClick OnWindowCLoseClick ] [ text "Cancel" ]
                , button [ class "uk-button uk-button-primary uk-width-1-2", onClick OnPreferencesSave ] [ text "Save Preferences" ]
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


viewCheckTodoisPremium : Bool -> Bool -> Html Msg
viewCheckTodoisPremium isPremium isLoading =
    if isPremium == True then
        div []
            [ span
                [ classList
                    [ ( "uk-text-success", isLoading == False )
                    , ( "uk-animation-scale-down", isLoading == False )
                    ]
                , class "uk-padding-small uk-padding-remove-vertical"
                , attribute "uk-icon" "check"
                ]
                []
            , button
                [ onClick OnTodoistPremiumCheckClick
                , type_ "button"
                , Html.Attributes.disabled isLoading
                , class "uk-button uk-button-primary"
                ]
                [ text "Recheck" ]
            ]

    else
        div []
            [ span
                [ classList
                    [ ( "uk-text-danger", isLoading == False )
                    , ( "uk-animation-scale-down", isLoading == False )
                    ]
                , class "uk-padding-small uk-padding-remove-vertical"
                , attribute "uk-icon" "warning"
                ]
                []
            , button
                [ onClick OnTodoistPremiumCheckClick
                , type_ "button"
                , Html.Attributes.disabled isLoading
                , class "uk-button uk-button-danger"
                ]
                [ text "Check" ]
            ]
